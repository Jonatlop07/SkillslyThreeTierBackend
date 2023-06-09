import TemporalPostRepository from '@core/domain/temporal-post/use-case/repository/temporal_post.repository';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { TemporalPostDTO } from '@core/domain/temporal-post/use-case/persistence-dto/temporal_post.dto';
import { QueryResult } from 'neo4j-driver';
import CreateTemporalPostPersistenceDTO
  from '@core/domain/temporal-post/use-case/persistence-dto/create_temporal_post.persistence_dto';
import {
  getCurrentDate,
  getCurrentDateWithExpiration
} from '@core/common/util/date/moment_utils';
import TemporalPostQueryModel from '@core/domain/temporal-post/use-case/query_model/temporal_post.query_model';
import { Optional } from '@core/common/type/common_types';

@Injectable()
export class TemporalPostNeo4jRepositoryAdapter implements TemporalPostRepository {

  constructor(private readonly neo4j_service: Neo4jService) {}

  public async create(temp_post: CreateTemporalPostPersistenceDTO): Promise<TemporalPostDTO> {
    const temp_post_key = 'tempPost';
    const user_key = 'user';
    const create_temp_post_query = `
      MATCH (${user_key}: User {user_id: $owner_id})
      CREATE (${temp_post_key}: TemporalPost)
      SET ${temp_post_key} += $properties, ${temp_post_key}.temporal_post_id = randomUUID()
      CREATE (${user_key})-[:${Relationships.USER_TEMP_POST_RELATIONSHIP}]->(${temp_post_key})
      RETURN ${temp_post_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      create_temp_post_query,
      {
        owner_id: temp_post.owner_id,
        properties: {
          description: temp_post.description,
          reference: temp_post.reference,
          referenceType: temp_post.referenceType,
          created_at: getCurrentDate(),
          expires_at: getCurrentDateWithExpiration(24, 'hours')
        }
      });
    const created_temp_post = this.neo4j_service.getSingleResultProperties(result, temp_post_key);
    return {
      temporal_post_id: created_temp_post.temporal_post_id,
      description: created_temp_post.description,
      reference: created_temp_post.reference,
      referenceType: created_temp_post.referenceType,
      owner_id: temp_post.owner_id,
      created_at: created_temp_post.created_at,
      expires_at: created_temp_post.expires_at
    };
  }

  public async delete(params: TemporalPostQueryModel): Promise<Optional<TemporalPostDTO> | void> {
    const { temporal_post_id } = params;
    const temp_post_key = 'tempPost';
    const deleted_post_key = 'deletedPost';
    const delete_post_query = `
      MATCH (${temp_post_key}: TemporalPost {temporal_post_id: $temporal_post_id})
      WITH ${temp_post_key}, properties(${temp_post_key}) as ${deleted_post_key}
      DETACH DELETE ${temp_post_key}
      RETURN ${deleted_post_key}`;
    await this.neo4j_service.write(
      delete_post_query,
      {
        temporal_post_id
      });
  }

  public async findOne(input: TemporalPostQueryModel): Promise<TemporalPostDTO> {
    const temp_post_key = 'tempPost';
    const get_temp_post_query = `
      MATCH (${temp_post_key}: TemporalPost {temporal_post_id: $temporal_post_id})
      RETURN ${temp_post_key}`;
    return this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.read(get_temp_post_query, {
        temporal_post_id: input.temporal_post_id
      }),
      temp_post_key
    ) as TemporalPostDTO;
  }

  public async findAll(input: TemporalPostQueryModel): Promise<TemporalPostDTO[]> {
    const user_request_key = 'userReq';
    const temp_posts_key = 'tempPost';
    const get_my_temporal_posts = `
      MATCH (${user_request_key} :User {user_id: $owner_id})
      -[:${Relationships.USER_TEMP_POST_RELATIONSHIP}]
      ->(${temp_posts_key}: TemporalPost)
      RETURN ${temp_posts_key}`;
    return this.neo4j_service.getMultipleResultByKey(
      await this.neo4j_service.read(
        get_my_temporal_posts,
        {
          owner_id: input.owner_id
        }),
      temp_posts_key
    ) as TemporalPostDTO[];
  }

  public async findAllWithRelationship(params: TemporalPostQueryModel): Promise<any> {
    const user_request_key = 'userReq';
    const user_followed_key = 'userFollowed';
    const temp_posts_key = 'tempPost';
    const get_friends_temp_posts_query = `
      MATCH (${user_request_key} :User {user_id: $user_id})-[:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${user_followed_key})
      MATCH (${user_followed_key})-[:${Relationships.USER_TEMP_POST_RELATIONSHIP}]->(${temp_posts_key}: TemporalPost)
      RETURN ${user_followed_key}, ${temp_posts_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      get_friends_temp_posts_query,
      {
        user_id: params.owner_id
      });
    const groupByUser = (temp_posts: QueryResult) => {
      const temporal_posts_by_user = {};
      temp_posts.records.forEach(temp_post => {
        const owner_id = temp_post.get(user_followed_key).properties.user_id;
        if (!temporal_posts_by_user[owner_id]) {
          temporal_posts_by_user[owner_id] = [];
        }
        const temporal_post = temp_post.get(temp_posts_key).properties;
        const user = temp_post.get(user_followed_key).properties;
        temporal_posts_by_user[owner_id].push({ ...temporal_post, email: user.email, name: user.name });
      });
      return temporal_posts_by_user;
    };
    return groupByUser(result);
  }
}
