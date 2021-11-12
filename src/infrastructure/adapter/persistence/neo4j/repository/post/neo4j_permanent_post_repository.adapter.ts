import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Optional } from '@core/common/type/common_types';
import { QueryResult } from 'neo4j-driver';
import * as moment from 'moment';
import PermanentPostRepository from '@core/domain/post/use-case/permanent_post.repository';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';

@Injectable()
export class PermanentPostNeo4jRepositoryAdapter
implements PermanentPostRepository {
  private readonly logger: Logger = new Logger(
    PermanentPostNeo4jRepositoryAdapter.name,
  );
  private static readonly USER_POST_RELATIONSHIP = 'HAS';

  constructor(private readonly neo4j_service: Neo4jService) {}

  public async create(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const post_key = 'post';
    const user_key = 'user';

    const content = post.content.map((contentElement) => {
      return JSON.stringify(contentElement);
    });
    const post_with_content_as_json = {
      ...post,
      content: content 
    };    
    const createPostStatement = `
        CREATE (${post_key}: Post)
        SET ${post_key} += $properties, ${post_key}.post_id = randomUUID()
        WITH (${post_key})
        MATCH (${user_key}: User)
        WHERE ${user_key}.user_id = ${post_key}.user_id
        CREATE (${user_key})-[:${PermanentPostNeo4jRepositoryAdapter.USER_POST_RELATIONSHIP}]->(${post_key})
        RETURN ${post_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      createPostStatement,
      {
        properties: {
          content: post_with_content_as_json.content,
          user_id: post_with_content_as_json.user_id,
          created_at: moment().local().format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    );

    return this.neo4j_service.getSingleResultProperties(result, post_key); 
  }

  async findOneByParam(
    param: string,
    value: any,
  ): Promise<Optional<PermanentPostDTO>> {
    const post_key = 'post';
    const find_post_query = `
      MATCH (${post_key}: PermanentPost { ${param}: ${value} })
      RETURN ${post_key}
    `;
    return this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.read(find_post_query, {}),
      post_key,
    );
  }
  public async findOne( params: PermanentPostQueryModel ): Promise<PermanentPostDTO>{
    const { user_id, post_id } = params;
    const user_key = 'user';
    const post_key = 'post';
    const find_post_query = `
      MATCH (${user_key}: User)-[:${PermanentPostNeo4jRepositoryAdapter.USER_POST_RELATIONSHIP}]->(${post_key}:Post)
      WHERE ${user_key}.user_id = ${user_id}
      AND ${user_key}.post_id = ${post_id}
      RETURN ${post_key}
    `;
    return this.neo4j_service.getSingleResultProperties(await this.neo4j_service.read(find_post_query, {}), post_key);
  }

  public async findAll( params: PermanentPostQueryModel ): Promise<PermanentPostDTO[]> {
    const { user_id } = params;
    const user_key = 'user';
    const post_key = 'post';
    const find_post_collection_query = `
      MATCH (${user_key}: User)-[:${PermanentPostNeo4jRepositoryAdapter.USER_POST_RELATIONSHIP}]->(${post_key}:Post)
      WHERE ${user_key}.user_id = ${user_id}
      RETURN ${post_key}
    `;
    const user_posts: PermanentPostDTO[] = await this.neo4j_service.read(find_post_collection_query,
      {}).then(
      (result: QueryResult) => 
        result.records.map(
          (record:any) => record._fields[0].properties
        ));
    return user_posts;
  }   
}
