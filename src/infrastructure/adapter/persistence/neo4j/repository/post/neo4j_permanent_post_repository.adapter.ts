import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Optional } from '@core/common/type/common_types';
import PermanentPostRepository from '@core/domain/post/use-case/permanent_post.repository';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence_dto/permanent_post.dto';
import * as moment from 'moment';

@Injectable()
export class PermanentPostNeo4jRepositoryAdapter implements PermanentPostRepository {
  private static readonly USER_POST_RELATIONSHIP = 'HAS';

  private readonly logger: Logger = new Logger(PermanentPostNeo4jRepositoryAdapter.name);

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

  async update(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const post_key = 'post';
    const update_permanent_post_query = `
      MATCH (${post_key}: PermanentPost { post_id: $id })
      SET ${post_key} = $properties
      RETURN ${post_key}
    `;
    const updated_post = await this.neo4j_service.write(
      update_permanent_post_query,
      {
        id: post.post_id,
        properties: {
          post_id: post.post_id,
          ...post,
          updated_at: moment().local().format('YYYY-MM-DD HH:mm:ss')
        }
      }
    );
    return this.neo4j_service.getSingleResultProperties(updated_post, 'post');
  }

  async findOneByParam(param: string, value: any): Promise<Optional<PermanentPostDTO>> {
    const post_key = 'post';
    const find_user_query = `
      MATCH (${post_key}: PermanentPost { ${param}: ${value} })
      RETURN ${post_key}
    `;
    return this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.read(
        find_user_query,
        {}
      ),
      post_key
    );
  }
}
