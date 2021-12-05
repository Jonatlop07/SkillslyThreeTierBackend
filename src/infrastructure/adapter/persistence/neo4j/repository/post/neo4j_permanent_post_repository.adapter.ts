import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import PermanentPostRepository from '@core/domain/post/use-case/repository/permanent_post.repository';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import * as moment from 'moment';

@Injectable()
export class PermanentPostNeo4jRepositoryAdapter
implements PermanentPostRepository {
  private readonly logger: Logger = new Logger(
    PermanentPostNeo4jRepositoryAdapter.name,
  );

  constructor(private readonly neo4j_service: Neo4jService) {}

  private readonly post_key = 'post';
  private readonly user_key = 'user';

  public async create(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const content = post.content.map((content_element) => {
      return JSON.stringify(content_element);
    });
    const post_with_content_as_json = {
      ...post,
      content,
    };
    const create_post_statement = `
      MATCH (${this.user_key}: User { user_id: $user_id })
      CREATE (${this.post_key}: PermanentPost)
      SET ${this.post_key} += $properties, ${this.post_key}.post_id = randomUUID()
      CREATE (${this.user_key})-[:${Relationships.USER_POST_RELATIONSHIP}]->(${this.post_key})
      RETURN ${this.post_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      create_post_statement,
      {
        user_id: post.user_id,
        properties: {
          content: post_with_content_as_json.content,
          created_at: moment().local().format('YYYY-MM-DD HH:mm:ss'),
          privacy: post.privacy,
        },
      },
    );
    const created_post = this.neo4j_service.getSingleResultProperties(
      result,
      this.post_key,
    );
    return {
      post_id: created_post.post_id,
      content: created_post.content,
      user_id: post.user_id,
      created_at: created_post.created_at,
      privacy: created_post.privacy,
    };
  }

  public async update(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const content = post.content.map((content_element) => {
      return JSON.stringify(content_element);
    });
    const { privacy } = post;
    const update_permanent_post_query = `
      MATCH (${this.post_key}: PermanentPost { post_id: $post_id })
      SET ${this.post_key} += $properties
      RETURN ${this.post_key}
    `;
    const result = await this.neo4j_service.write(update_permanent_post_query, {
      post_id: post.post_id,
      properties: {
        content,
        privacy,
        updated_at: moment().local().format('YYYY-MM-DD HH:mm:ss')
      },
    });
    const updated_post = this.neo4j_service.getSingleResultProperties(
      result,
      'post',
    );
    return {
      post_id: updated_post.post_id,
      content: updated_post.content,
      privacy: updated_post.privacy,
      created_at: updated_post.created_at,
      updated_at: updated_post.updated_at,
    };
  }

  public async share(post: PermanentPostQueryModel) {
    const share_permanent_post_query = `
      MATCH (${this.user_key}: User { user_id: $user_id })
      MATCH (${this.post_key}: PermanentPost { post_id: $post_id })
      CREATE (${this.user_key})-[:${Relationships.USER_SHARE_RELATIONSHIP}]->(${this.post_key})
    `;
    await this.neo4j_service.write(share_permanent_post_query, {
      user_id: post.user_id,
      post_id: post.post_id,
    });
    return {};
  }

  public async findOne(
    params: PermanentPostQueryModel,
  ): Promise<PermanentPostDTO> {
    const { post_id } = params;
    const user_id_key = 'user_id';
    const find_post_query = `
      MATCH (${this.user_key}: User)
        -[:${Relationships.USER_POST_RELATIONSHIP}]
        ->(${this.post_key}: PermanentPost { post_id: $post_id })
      RETURN ${this.post_key}, ${this.user_key}.user_id AS ${user_id_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(find_post_query, {
      post_id,
    });

    if (!this.neo4j_service.getSingleResultProperties(result, this.post_key)) {
      return undefined;
    }
    return {
      ...this.neo4j_service.getSingleResultProperties(result, this.post_key),
      user_id: this.neo4j_service.getSingleResultProperties(
        result,
        user_id_key,
      ),
    };
  }

  public async findAll(
    params: PermanentPostQueryModel,
  ): Promise<PermanentPostDTO[]> {
    const { user_id } = params;
    const find_post_collection_query = `
      MATCH (${this.user_key}: User { user_id: $user_id })
        -[:${Relationships.USER_POST_RELATIONSHIP}]
        ->(${this.post_key}: PermanentPost)
      RETURN ${this.post_key}, ${this.user_key}.user_id
    `;
    const result = await this.neo4j_service
      .read(find_post_collection_query, {
        user_id,
      })
      .then((result: QueryResult) =>
        result.records.map((record: any) => {
          return {
            privacy: record._fields[0].properties.privacy,
            created_at: record._fields[0].properties.created_at,
            post_id: record._fields[0].properties.post_id,
            user_id: record._fields[1],
            content: record._fields[0].properties.content,
          };
        }),
      );

    return result.map((post) => ({
      ...post,
      content: post.content.map((content_element) =>
        JSON.parse(content_element),
      ),
    }));
  }

  async getPublicPosts(params: PermanentPostQueryModel): Promise<PermanentPostDTO[]> {
    const { user_id } = params;
    const find_public_posts_collection_query = `
      MATCH (${this.user_key}: User { user_id: $user_id })
        -[:${Relationships.USER_POST_RELATIONSHIP}]
        ->(${this.post_key}: PermanentPost { privacy: 'public'})
      RETURN ${this.post_key}, ${this.user_key}.user_id
    `;
    const result = await this.neo4j_service
      .read(find_public_posts_collection_query, { user_id })
      .then((result: QueryResult) => 
        result.records.map((record: any) => {
          return {
            privacy: record._fields[0].properties.privacy,
            created_at: record._fields[0].properties.created_at,
            post_id: record._fields[0].properties.post_id,
            user_id: record._fields[1],
            content: record._fields[0].properties.content,
          };
        })
      );

    return result.map((post) => ({
      ...post,
      content: post.content.map((content_element) => 
        JSON.parse(content_element)
      ),
    }));
  }

  public async exists(post: PermanentPostDTO): Promise<boolean> {
    return await this.existsById(post.post_id);
  }

  public async existsById(id: string): Promise<boolean> {
    const exists_post_query = `
      MATCH (${this.post_key}: PermanentPost { post_id: $id })
      RETURN ${this.post_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_post_query,
      { id },
    );
    return result.records.length > 0;
  }
}
