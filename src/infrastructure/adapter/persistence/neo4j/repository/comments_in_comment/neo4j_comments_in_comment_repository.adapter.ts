import { Injectable } from '@nestjs/common';
import CommentInCommentRepository from '@core/domain/comment/use-case/repository/comment_in_comment.repository';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { CommentOfCommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment_of_comment.dto';
import CreateCommentInCommentPersistenceDTO
  from '@core/domain/comment/use-case/persistence-dto/create_comment_in_comment.persistence_dto';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';
import CommentOfCommentQueryModel from '@core/domain/comment/use-case/query-model/comment_of_comment.query_model';

@Injectable()
export class CommentsInCommentNeo4jRepositoryAdapter implements CommentInCommentRepository {
  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(comment: CreateCommentInCommentPersistenceDTO): Promise<CommentOfCommentDTO> {
    const ancestor_comment_key = 'ancestor_comment';
    const comment_key = 'comment';
    const user_key = 'user';
    const create_comment_query = `
      MATCH 
        (${ancestor_comment_key}: Comment { comment_id: '${comment.ancestorCommentID}' }),
        (${user_key}: User { user_id: '${comment.userID}' })
      CREATE (${comment_key}: Comment)
      SET ${comment_key} += $properties, ${comment_key}.comment_id = randomUUID()
      CREATE (${comment_key})-[:${Relationships.COMMENT_COMMENT_RELATIONSHIP}]->(${ancestor_comment_key})
      CREATE (${comment_key})-[:${Relationships.COMMENT_USER_RELATIONSHIP}]->(${user_key})
      RETURN ${comment_key}
    `;
    const created_comment = await this.neo4j_service.write(create_comment_query, {
      properties: {
        comment: comment.comment,
        timestamp: comment.timestamp,
      },
    });

    return this.neo4j_service.getSingleResultProperties(created_comment, comment_key) as CommentOfCommentDTO;
  }

  public async findAll(params: CommentOfCommentQueryModel, pagination: PaginationDTO): Promise<Array<CommentOfCommentDTO>> {
    const result_key = 'result';
    const ancestor_comment_key = 'ancestor_comment_key';
    const comment_key = 'comment';
    const user_key = 'user';
    const get_all_comments_query = `
      MATCH (${ancestor_comment_key}: Comment { comment_id: $comment_id })
        <-[:${Relationships.COMMENT_COMMENT_RELATIONSHIP}]-(${comment_key}: Comment)
        -[:${Relationships.COMMENT_USER_RELATIONSHIP}]
        ->(${user_key}: User)
      WITH {
        comment_id: ${comment_key}.comment_id,
        comment: ${comment_key}.comment,
        timestamp: ${comment_key}.timestamp,
        userID: ${user_key}.user_id,
        ancestorCommentID: ${ancestor_comment_key}.comment_id
      } as ${result_key}
      RETURN ${result_key}
      ORDER BY ${result_key}.timestamp DESC
      SKIP ${pagination.offset}
      LIMIT ${pagination.limit}
    `;
    const comments = await this.neo4j_service.read(get_all_comments_query, {
      comment_id: params.ancestorCommentID
    });
    return this.neo4j_service.getMultipleResultByKey(comments, result_key);
  }
}
