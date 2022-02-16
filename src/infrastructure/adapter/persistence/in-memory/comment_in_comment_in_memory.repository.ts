import CommentInCommentRepository from '@core/domain/comment/use-case/repository/comment_in_comment.repository';
import { CommentOfCommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment_of_comment.dto';
import CommentOfCommentQueryModel from '@core/domain/comment/use-case/query-model/comment_of_comment.query_model';


export class CommentInCommentInMemoryRepository implements CommentInCommentRepository {
  private currently_available_comment_id: string;

  constructor(private readonly comments: Map<string, CommentOfCommentDTO>) {
    this.currently_available_comment_id = '1';
  }

  async create(comment: CommentOfCommentDTO): Promise<CommentOfCommentDTO> {
    const new_comment: CommentOfCommentDTO = {
      comment_id: this.currently_available_comment_id,
      comment: comment.comment,
      timestamp: comment.timestamp,
      ancestor_comment_id: comment.ancestor_comment_id,
      owner_id: comment.owner_id
    };
    this.comments.set(this.currently_available_comment_id, new_comment);
    this.currently_available_comment_id = String(Number(this.currently_available_comment_id) + 1);
    return Promise.resolve(new_comment);
  }


  public findAll(params: CommentOfCommentQueryModel): Promise<Array<CommentOfCommentDTO>> {
    const comments: Array<CommentOfCommentDTO> = [];
    for (const comment of this.comments.values()) {
      if (comment.ancestor_comment_id === params.ancestor_comment_id)
        comments.push({
          comment_id: comment.comment_id,
          comment: comment.comment,
          timestamp: comment.timestamp,
          ancestor_comment_id: comment.ancestor_comment_id,
          owner_id: comment.owner_id
        });
    }
    return Promise.resolve(comments);
  }
}
