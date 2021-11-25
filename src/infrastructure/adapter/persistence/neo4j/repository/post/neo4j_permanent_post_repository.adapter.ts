import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import PermanentPostRepository from '@core/domain/post/use-case/repository/permanent_post.repository';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import { Optional } from '@core/common/type/common_types';
import * as moment from 'moment';

@Injectable()
export class PermanentPostNeo4jRepositoryAdapter implements PermanentPostRepository {
  private readonly logger: Logger = new Logger(PermanentPostNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) { }

  public async create(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const post_key = 'post';
    const user_key = 'user';
    const content = post.content.map((content_element) => {
      return JSON.stringify(content_element);
    });
    const post_with_content_as_json = {
      ...post,
      content
    };
    const create_post_statement = `
      MATCH (${user_key}: User { user_id: '${post.user_id}' })
      CREATE (${post_key}: PermanentPost)
      SET ${post_key} += $properties, ${post_key}.post_id = randomUUID()
      CREATE (${user_key})-[:${Relationships.USER_POST_RELATIONSHIP}]->(${post_key})
      RETURN ${post_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      create_post_statement,
      {
        properties: {
          content: post_with_content_as_json.content,
          created_at: moment().local().format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    );
    const created_post = this.neo4j_service.getSingleResultProperties(result, post_key);
    return {
      post_id: created_post.post_id,
      content: created_post.content,
      user_id: post.user_id,
      created_at: created_post.created_at
    };
  }

  public async update(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const content = post.content.map((content_element) => {
      return JSON.stringify(content_element);
    });
    const post_key = 'post';
    const update_permanent_post_query = `
      MATCH (${post_key}: PermanentPost { post_id: '${post.post_id}' })
      SET ${post_key} += $properties
      RETURN ${post_key}
    `;
    const result = await this.neo4j_service.write(
      update_permanent_post_query,
      {
        properties: {
          content,
          updated_at: moment().local().format('YYYY-MM-DD HH:mm:ss')
        }
      }
    );
    const updated_post = this.neo4j_service.getSingleResultProperties(result, 'post');
    return {
      post_id: updated_post.post_id,
      content: updated_post.content,
      user_id: post.user_id,
      created_at: updated_post.created_at,
      updated_at: updated_post.updated_at
    };
  }

  public async findOneByParam(param: string, value: any): Promise<Optional<PermanentPostDTO>> {
    const user_key = 'user';
    const post_key = 'post';
    const user_id_key = 'user_id';
    const formatted_value = typeof value === 'string' || value instanceof String ? `'${value}'` : value;
    const find_user_query = `
      MATCH (${post_key}:PermanentPost { ${param}: ${formatted_value} }),
      (${user_key}:User)-[:${Relationships.USER_POST_RELATIONSHIP}]->(${post_key}:PermanentPost)
      RETURN ${post_key}, ${user_key} AS ${user_id_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      find_user_query,
      {}
    );
    const post = this.neo4j_service.getSingleResultProperties(result, post_key);
    const user_id = result.records[0]?.get(user_id_key);
    if (!post){
      return undefined;
    }
    const postToReturn = {
      post_id: post.post_id,
      content: post.content,
      user_id,
      created_at: post.created_at,
      updated_at: post.updated_at
    };
    return postToReturn;
  }

  public async findOne(params: PermanentPostQueryModel): Promise<PermanentPostDTO> {
    const { user_id, post_id } = params;
    const user_key = 'user';
    const post_key = 'post';
    const find_post_query = `
      MATCH (${user_key}: User)-[:${Relationships.USER_POST_RELATIONSHIP}]->(${post_key}: PermanentPost)
      WHERE ${user_key}.user_id = '${user_id}'
      AND ${post_key}.post_id = '${post_id}'
      RETURN ${post_key}
    `;
    return this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.read(find_post_query, {}),
      post_key
    );
  }

  public async findAll(params: PermanentPostQueryModel): Promise<PermanentPostDTO[]> {
    const { user_id } = params;
    const user_key = 'user';
    const post_key = 'post';
    const find_post_collection_query = `
      MATCH (${user_key}: User)-[:${Relationships.USER_POST_RELATIONSHIP}]->(${post_key}: PermanentPost)
      WHERE ${user_key}.user_id = '${user_id}'
      RETURN ${post_key}
    `;
    const result = await this.neo4j_service
      .read(
        find_post_collection_query,
        {}
      ).then(
        (result: QueryResult) =>
          result.records.map(
            (record: any) => record._fields[0].properties
          )
      );
    return result.map(post => ({
      ...post,
      content: post.content.map(
        content_element => JSON.parse(content_element),
      )
    }));
  }
}
