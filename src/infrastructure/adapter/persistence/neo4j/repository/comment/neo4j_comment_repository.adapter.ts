import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import CommentRepository from '@core/domain/comment/use-case/repository/comment.repository';
import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import GetCommentsInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_permanent_post.input_model';
import { GetCommentsInPermanentPostOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_permanent_post.output_model';
import { QueryResult } from 'neo4j-driver';


@Injectable()
export class CommentNeo4jRepositoryAdapter implements CommentRepository {
  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(comment: CommentDTO): Promise<CommentDTO> {
    const post_key = 'post';
    const comment_key = 'comment';
    const user_key = 'user';
    const create_comment_query = `
      MATCH 
        (${post_key}: PermanentPost { post_id: '${comment['postID']}' }),
        (${user_key}: User { user_id: '${comment['userID']}' })
      CREATE (${comment_key}: Comment)
      SET ${comment_key} += $properties, ${comment_key}.comment_id = randomUUID()
      CREATE (${post_key})-[:${Relationships.POST_COMMENT_RELATIONSHIP}]->(${comment_key})
      CREATE (${comment_key})-[:${Relationships.COMMENT_USER_RELATIONSHIP}]->(${user_key})
      RETURN ${comment_key}
    `;
    const created_comment = await this.neo4j_service.write(create_comment_query, {
      properties: {
        comment: comment['comment'],
        timestamp: comment['timestamp'],
      },
    });

    return this.neo4j_service.getSingleResultProperties(created_comment, comment_key) as CommentDTO;
  }

  public async findAll(input: GetCommentsInPermanentPostInputModel): Promise<Array<GetCommentsInPermanentPostOutputModel>> {
    const post_key = 'post';
    const comment_key = 'comment';
    const user_key = 'user';
    const get_all_comments_query = `
      MATCH(${post_key}: PermanentPost { post_id: '${input.postID}' })--(${comment_key}: Comment)--(${user_key}: User)
      RETURN ${comment_key}, ${user_key}
      ORDER BY ${comment_key}.timestamp DESC
      SKIP ${input.page * input.limit}
      LIMIT ${input.limit}
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