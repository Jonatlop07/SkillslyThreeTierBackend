import { Injectable } from '@nestjs/common';
import CommentInCommentRepository from '@core/domain/comment/use-case/repository/comment_in_comment.repository';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { GetCommentsInPermanentPostOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_permanent_post.output_model';
import { QueryResult } from 'neo4j-driver';
import { CommentOfCommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment_of_comment.dto';
import GetCommentsInCommentInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_comment.input_model';
import { GetCommentsInCommentOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_comment.output_model';
import CreateCommentInCommentPersistenceDTO
  from '@core/domain/comment/use-case/persistence-dto/create_comment_in_comment.persistence_dto';

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

  public async findAll(input: GetCommentsInCommentInputModel): Promise<Array<GetCommentsInCommentOutputModel>> {
    const ancestor_comment_key = 'ancestor_comment_key';
    const comment_key = 'comment';
    const user_key = 'user';
    const get_all_comments_query = `
      MATCH(${ancestor_comment_key}: Comment { comment_id: '${input['ancestorCommentID']}' })--(${comment_key}: Comment)--(${user_key}: User)
      RETURN ${comment_key}, ${user_key}
      ORDER BY ${comment_key}.timestamp DESC
      SKIP ${input['page'] * input['limit']}
      LIMIT ${input['limit']}
    `;
    const comments = await this.neo4j_service.read(get_all_comments_query, {});
    return this.extractResults(comments);

  }

  public findOne() {
    return null;
  }

  public findAllWithRelation() {
    return null;
  }


  private extractResults(results: QueryResult): Array<GetCommentsInPermanentPostOutputModel> {
    const commentData = [];
    for (const result of results.records) {
      let properties = {};
      for (const key of result.keys) {
        properties = Object.assign(properties, result.get(key).properties);
      }
      const comment: GetCommentsInPermanentPostOutputModel = {
        id: properties['comment_id'],
        comment: properties['comment'],
        timestamp: properties['timestamp'],
        name: properties['name'],
        email: properties['email'],
      };
      commentData.push(comment);
    }
    return commentData;
  }


}
