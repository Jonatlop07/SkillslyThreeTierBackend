import TemporalPostRepository from '@core/domain/temp-post/use-case/repository/temporal_post.repository';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import { QueryResult } from 'neo4j-driver';
import * as moment from 'moment';
import QueryTemporalPostCollectionInputModel
  from '@core/domain/temp-post/use-case/input-model/query_temporal_post_collection.input_model';
import QueryTemporalPostInputModel from '@core/domain/temp-post/use-case/input-model/query_temporal_post.input_model';

@Injectable()
export class TemporalPostNeo4jRepositoryAdapter implements TemporalPostRepository {

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(temp_post: TemporalPostDTO): Promise<TemporalPostDTO> {
    const temp_post_key = 'tempPost';
    const user_key = 'user';

    const create_temp_post_query = `
      MATCH (${user_key}: User {user_id: $user_id})
      CREATE (${temp_post_key}: TemporalPost)
      SET ${temp_post_key} += $properties, ${temp_post_key}.temporal_post_id = randomUUID()
      CREATE (${user_key})-[:${Relationships.USER_TEMP_POST_RELATIONSHIP}]->(${temp_post_key})
      RETURN ${temp_post_key}
    `;

    const result: QueryResult = await this.neo4j_service.write(
      create_temp_post_query,
      {
        user_id: temp_post.user_id,
        properties: {
          description: temp_post.description,
          reference: temp_post.reference,
          referenceType: temp_post.referenceType,
          created_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
          expires_at: moment().add(24, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
        },
      });

    const created_temp_post = this.neo4j_service.getSingleResultProperties(result, temp_post_key);

    return {
      temporal_post_id: created_temp_post.temporal_post_id,
      description: created_temp_post.description,
      reference: created_temp_post.reference,
      referenceType: created_temp_post.referenceType,
      user_id: temp_post.user_id,
      created_at: created_temp_post.created_at,
      expires_at: created_temp_post.expires_at,
    };
  }

  public delete() {
    return null;
  }

  public async deleteById(temporal_post_id: string): Promise<TemporalPostDTO> {
    const temp_post_key = 'tempPost';
    const deleted_post_key = 'deletedPost';
    const delete_post_query = `
      MATCH (${temp_post_key}: TemporalPost {temporal_post_id: $temporal_post_id})
      WITH ${temp_post_key}, properties(${temp_post_key}) as ${deleted_post_key}
      DETACH DELETE ${temp_post_key}
      RETURN ${deleted_post_key}`;

    const result: QueryResult = await this.neo4j_service.write(
      delete_post_query,
      {
        temporal_post_id: temporal_post_id,
      });

    return result.records[0].get(deleted_post_key) as TemporalPostDTO;


  }

  public async findOne(input: QueryTemporalPostInputModel): Promise<TemporalPostDTO> {
    const temp_post_key = 'tempPost';

    const get_temp_post_query = `
      MATCH (${temp_post_key}: TemporalPost {temporal_post_id: $temporal_post_id})
      RETURN ${temp_post_key}`;

    const result: QueryResult = await this.neo4j_service.read(get_temp_post_query, {
      temporal_post_id: input.temporal_post_id,
    });

    return this.neo4j_service.getSingleResultProperties(result, temp_post_key) as TemporalPostDTO;

  }

  public async findAllWithRelation(input: QueryTemporalPostCollectionInputModel): Promise<any> {
    const user_request_key = 'userReq';
    const user_followed_key = 'userFollowed';
    const temp_posts_key = 'tempPost';

    const get_friends_temp_posts_query = `
      MATCH (${user_request_key} :User {user_id: $user_id})-[:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${user_followed_key})
      MATCH (${user_followed_key})-->(${temp_posts_key}: TemporalPost)
      RETURN ${user_followed_key}, ${temp_posts_key}
    `;

    const result: QueryResult = await this.neo4j_service.read(
      get_friends_temp_posts_query,
      {
        user_id: input.user_id,
      });

    const groupByUser = (temp_posts: QueryResult) => {
      const temporal_posts_by_user = {};
      temp_posts.records.forEach(temp_post => {
        const user_id = temp_post.get(user_followed_key).properties.user_id;
        if (!temporal_posts_by_user[user_id]) {
          temporal_posts_by_user[user_id] = [];
        }
        const temporal_post = temp_post.get(temp_posts_key).properties;
        const user = temp_post.get(user_followed_key).properties;
        temporal_posts_by_user[user_id].push({ ...temporal_post, email: user['email'], name: user['name'] });
      });
      return temporal_posts_by_user;
    };


    return groupByUser(result);

  }

  public async findAll(input: QueryTemporalPostCollectionInputModel): Promise<TemporalPostDTO[]> {
    const user_request_key = 'userReq';
    const temp_posts_key = 'tempPost';

    const get_my_temporal_posts = `
      MATCH (${user_request_key} :User {user_id: $user_id})-->(${temp_posts_key}: TemporalPost)
      RETURN ${temp_posts_key}`;

    const result: QueryResult = await this.neo4j_service.read(
      get_my_temporal_posts,
      {
        user_id: input.user_id,
      });

    return this.neo4j_service.getMultipleResultByKey(result, temp_posts_key) as TemporalPostDTO[];
  }


}