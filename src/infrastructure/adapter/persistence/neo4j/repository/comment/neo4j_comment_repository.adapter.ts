import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import CommentRepository from '@core/domain/comment/use-case/repository/comment.repository';
import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import CreateCommentPersistenceDTO from '@core/domain/comment/use-case/persistence-dto/create_comment.persistence_dto';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';
import CommentQueryModel from '@core/domain/comment/use-case/query-model/comment.query_model';


@Injectable()
export class CommentNeo4jRepositoryAdapter implements CommentRepository {
  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(comment: CreateCommentPersistenceDTO): Promise<CommentDTO> {
    const post_key = 'post';
    const comment_key = 'comment';
    const user_key = 'user';
    const create_comment_query = `
      MATCH 
        (${post_key}: PermanentPost { post_id: $post_id }),
        (${user_key}: User { user_id: $owner_id })
      CREATE (${comment_key}: Comment)
      SET ${comment_key} += $properties, ${comment_key}.comment_id = randomUUID()
      CREATE (${post_key})-[:${Relationships.POST_COMMENT_RELATIONSHIP}]->(${comment_key})
      CREATE (${comment_key})-[:${Relationships.COMMENT_USER_RELATIONSHIP}]->(${user_key})
      RETURN ${comment_key}
    `;
    const created_comment = await this.neo4j_service.write(create_comment_query, {
      properties: {
        post_id: comment.postID,
        owner_id: comment.ownerID,
        comment: comment.comment,
        timestamp: comment.timestamp
      },
    });
    return this.neo4j_service.getSingleResultProperties(created_comment, comment_key) as CommentDTO;
  }

  public async findAll(params: CommentQueryModel, pagination: PaginationDTO): Promise<Array<CommentDTO>> {
    const result_key = 'result';
    const post_key = 'post';
    const comment_key = 'comment';
    const user_key = 'user';
    const get_all_comments_query = `
      MATCH (${post_key}: PermanentPost { post_id: $post_id })
        -[:${Relationships.POST_COMMENT_RELATIONSHIP}]
        ->(${comment_key}: Comment)
        -[:${Relationships.COMMENT_USER_RELATIONSHIP}]
        ->(${user_key}: User)
      WITH {
        comment_id: ${comment_key}.comment_id,
        comment: ${comment_key}.comment,
        timestamp: ${comment_key}.timestamp,
        ownerID: ${user_key}.user_id,
        postID: ${post_key}.post_id
      } as ${result_key}
      RETURN ${result_key}
      ORDER BY ${result_key}.timestamp DESC
      SKIP ${pagination.offset}
      LIMIT ${pagination.limit}
    `;
    const comments = await this.neo4j_service.read(get_all_comments_query, {
      post_id: params.postID
    });
    return this.neo4j_service.getMultipleResultByKey(comments, result_key);
  }
}
