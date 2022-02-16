import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import PermanentPostRepository from '@core/domain/permanent-post/use-case/repository/permanent_post.repository';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/permanent-post/use-case/query-model/permanent_post.query_model';
import { PaginationDTO } from '@application/api/http-rest/http-dto/http_pagination.dto';
import CreatePermanentPostPersistenceDTO
  from '@core/domain/permanent-post/use-case/persistence-dto/create_permanent_post.persistence_dto';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import SharePermanentPostPersistenceDTO
  from '@core/domain/permanent-post/use-case/persistence-dto/share_permanent_post.persistence_dto';

@Injectable()
export class PermanentPostNeo4jRepositoryAdapter
implements PermanentPostRepository {
  private readonly logger: Logger = new Logger(
    PermanentPostNeo4jRepositoryAdapter.name,
  );

  constructor(private readonly neo4j_service: Neo4jService) {}

  private readonly post_key = 'post';
  private readonly user_key = 'user';
  private readonly group_key = 'group';

  public async create(post: CreatePermanentPostPersistenceDTO): Promise<PermanentPostDTO> {
    const content = post.content.map((content_element) => {
      return JSON.stringify(content_element);
    });
    const group_id = post.group_id ? post.group_id : '0';
    const post_with_content_as_json = {
      ...post,
      content,
    };
    let create_post_statement = `
      MATCH (${this.user_key}: User { user_id: $owner_id })
      CREATE (${this.post_key}: PermanentPost)
      SET ${this.post_key} += $properties, ${this.post_key}.post_id = randomUUID()
      CREATE (${this.user_key})-[:${Relationships.USER_POST_RELATIONSHIP}]->(${this.post_key})
      RETURN ${this.post_key}
    `;
    if (post.group_id) {
      create_post_statement = `
        MATCH (${this.user_key}: User { user_id: $owner_id }), ( group: Group { group_id: $group_id })
        CREATE (${this.post_key}: PermanentPost)
        SET ${this.post_key} += $properties, ${this.post_key}.post_id = randomUUID()
        CREATE (${this.user_key})-[:${Relationships.USER_POST_RELATIONSHIP}]->(${this.post_key})
        CREATE (${this.group_key})<-[:${Relationships.GROUP_POST_RELATIONSHIP}]-(${this.post_key})
        RETURN ${this.post_key}
      `;
    }
    const result: QueryResult = await this.neo4j_service.write(
      create_post_statement,
      {
        owner_id: post.owner_id,
        group_id: group_id,
        properties: {
          content: post_with_content_as_json.content,
          created_at: getCurrentDate(),
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
      content: created_post.content.map((content_element) => {
        return JSON.parse(content_element);
      }),
      owner_id: post.owner_id,
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
        updated_at: getCurrentDate(),
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
      owner_id: post.owner_id,
    };
  }

  public async share(dto: SharePermanentPostPersistenceDTO): Promise<void> {
    const share_permanent_post_query = `
      MATCH (${this.user_key}: User { user_id: $user_that_shares_id })
      MATCH (${this.post_key}: PermanentPost { post_id: $post_id })
      CREATE (${this.user_key})-[:${Relationships.USER_SHARE_RELATIONSHIP}]->(${this.post_key})
    `;
    await this.neo4j_service.write(share_permanent_post_query, {
      user_that_shares_id: dto.user_that_shares_id,
      post_id: dto.post_id,
    });
  }

  public async findOne(params: PermanentPostQueryModel): Promise<PermanentPostDTO> {
    const { post_id } = params;
    const owner_id_key = 'owner_id';
    const find_post_query = `
      MATCH (${this.user_key}: User)
        -[:${Relationships.USER_POST_RELATIONSHIP}]
        ->(${this.post_key}: PermanentPost { post_id: $post_id })
      RETURN ${this.post_key}, ${this.user_key}.user_id AS ${owner_id_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(find_post_query, {
      post_id,
    });
    const found_post = this.neo4j_service.getSingleResultProperties(
      result,
      this.post_key,
    );
    if (!found_post)
      return null;
    return {
      post_id: found_post.post_id,
      content: found_post.content.map((content_element) =>
        JSON.parse(content_element),
      ),
      owner_id: this.neo4j_service.getSingleResultProperty(result, owner_id_key),
      privacy: found_post.privacy,
    };
  }

  public async findAll(params: PermanentPostQueryModel): Promise<PermanentPostDTO[]> {
    const { owner_id } = params;
    const find_post_collection_query = `
      MATCH (${this.user_key}: User { user_id: $owner_id })
        -[:${Relationships.USER_POST_RELATIONSHIP}]
        ->(${this.post_key}: PermanentPost)
      WHERE NOT (${this.post_key})-[:${Relationships.GROUP_POST_RELATIONSHIP}]->(:Group)
      RETURN ${this.post_key}, ${this.user_key}.user_id
    `;
    const result = await this.neo4j_service
      .read(find_post_collection_query, {
        owner_id
      })
      .then((result: QueryResult) =>
        result.records.map((record: any) => {
          return {
            privacy: record._fields[0].properties.privacy,
            created_at: record._fields[0].properties.created_at,
            post_id: record._fields[0].properties.post_id,
            owner_id: record._fields[1],
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

  public async getPublicPosts(params: PermanentPostQueryModel,): Promise<PermanentPostDTO[]> {
    const { owner_id } = params;
    const find_public_posts_collection_query = `
      MATCH (${this.user_key}: User { user_id: $owner_id })
        -[:${Relationships.USER_POST_RELATIONSHIP}]
        ->(${this.post_key}: PermanentPost { privacy: 'public'})
      WHERE NOT (${this.post_key})-[:${Relationships.GROUP_POST_RELATIONSHIP}]->(:Group)
      RETURN ${this.post_key}, ${this.user_key}.user_id
    `;
    const result = await this.neo4j_service
      .read(find_public_posts_collection_query, { owner_id })
      .then((result: QueryResult) =>
        result.records.map((record: any) => {
          return {
            privacy: record._fields[0].properties.privacy,
            created_at: record._fields[0].properties.created_at,
            post_id: record._fields[0].properties.post_id,
            owner_id: record._fields[1],
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

  public async getPostsOfFriends(id: string, pagination: PaginationDTO): Promise<PermanentPostDTO[]> {
    const limit = pagination.limit || 25;
    const offset = pagination.offset || 0;
    const result_key = 'result';
    const friend_key = 'friend';
    const get_friends_collection_query = `
      MATCH (${this.user_key}: User { user_id: $id })
      -[:${Relationships.USER_FOLLOW_RELATIONSHIP}]
      ->(${friend_key}: User)
      RETURN ${friend_key}
    `;
    const friends_ids = await this.neo4j_service
      .read(get_friends_collection_query, { id })
      .then((result: QueryResult) =>
        result.records.map(
          (record: any) => record._fields[0].properties.user_id,
        ),
      );
    const get_posts_of_friends_collection_query = `
      UNWIND $friends_ids as friend_id
      MATCH (${friend_key}: User {user_id: friend_id})
        -[:${Relationships.USER_POST_RELATIONSHIP}]
        ->(${this.post_key}: PermanentPost)
      WHERE NOT (:Group)<-[:${Relationships.GROUP_POST_RELATIONSHIP}]-(${this.post_key})  
      WITH {
        privacy: ${this.post_key}.privacy,
        created_at: ${this.post_key}.created_at,
        post_id: ${this.post_key}.post_id,
        content: ${this.post_key}.content,
        owner_id: ${friend_key}.user_id
      } AS ${result_key}
      RETURN DISTINCT ${result_key}
      ORDER BY ${result_key}.created_at DESC
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result = await this.neo4j_service
      .read(get_posts_of_friends_collection_query, { friends_ids })
      .then((result: QueryResult) =>
        result.records.map((record: any) => {
          const { privacy, created_at, post_id, content, owner_id } =
            record._fields[0];
          return {
            privacy,
            created_at,
            post_id,
            content,
            owner_id
          };
        }),
      );
    return result.map((post) => ({
      ...post,
      content: post.content.map((content_element) =>{
        return JSON.parse(content_element);
      })
    }));
  }

  async getGroupPosts(group_id: string, pagination: PaginationDTO): Promise<PermanentPostDTO[]> {
    const limit = pagination.limit || 25;
    const offset = pagination.offset || 0;
    const get_group_posts_query = `
      MATCH (${this.group_key}: Group { group_id: $group_id })
        <-[:${Relationships.GROUP_POST_RELATIONSHIP}]
        -(${this.post_key}: PermanentPost)
        <-[:${Relationships.USER_POST_RELATIONSHIP}]
        -(${this.user_key}:User)
      RETURN ${this.post_key}, ${this.user_key}.user_id
      ORDER BY ${this.post_key}.created_at DESC
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result = await this.neo4j_service
      .read(get_group_posts_query, { group_id })
      .then((result: QueryResult) =>
        result.records.map((record: any) => {
          return {
            created_at: record._fields[0].properties.created_at,
            post_id: record._fields[0].properties.post_id,
            owner_id: record._fields[1],
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

  public async exists(params: PermanentPostQueryModel): Promise<boolean> {
    const exists_post_query = `
      MATCH (${this.post_key}: PermanentPost { post_id: $id })
      RETURN ${this.post_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_post_query,
      { id: params.post_id },
    );
    return result.records.length > 0;
  }

  async deleteGroupPost(post_id: string, group_id: string): Promise<void> {
    const delete_group_post_query = `
      MATCH (${this.group_key}: Group { group_id: $group_id })
        <-[:${Relationships.GROUP_POST_RELATIONSHIP}]
        -(${this.post_key}: PermanentPost { post_id: $post_id })
      DETACH DELETE ${this.post_key}
    `;
    await this.neo4j_service.write(delete_group_post_query, { group_id, post_id });
  }

  public async delete(params: PermanentPostQueryModel): Promise<PermanentPostDTO> {
    const post_key = 'post';
    const user_key = 'user';
    const delete_permanent_post_statement = `
      MATCH (${post_key}: PermanentPost { post_id: $id })
        <-[:${Relationships.USER_POST_RELATIONSHIP}]
        -(${user_key}: User)
      DETACH DELETE ${post_key}
      RETURN ${post_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      delete_permanent_post_statement,
      { id: params.post_id },
    );
    return this.neo4j_service.getSingleResultProperties(result, post_key);
  }
}
