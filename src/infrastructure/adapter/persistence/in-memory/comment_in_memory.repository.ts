import CommentRepository from '@core/domain/comment/use-case/repository/comment.repository';
import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';
import CommentQueryModel from '@core/domain/comment/use-case/query-model/comment.query_model';

export class CommentInMemoryRepository implements CommentRepository {
  private currently_available_comment_id: string;

  constructor(private readonly comments: Map<string, CommentDTO>) {
    this.currently_available_comment_id = '1';
  }

  async create(comment: CommentDTO): Promise<CommentDTO> {
    const new_comment: CommentDTO = {
      comment_id: this.currently_available_comment_id,
      comment: comment.comment,
      timestamp: comment.timestamp,
      post_id: comment.post_id,
      owner_id: comment.owner_id,
    };
    this.comments.set(this.currently_available_comment_id, new_comment);
    this.currently_available_comment_id = String(Number(this.currently_available_comment_id) + 1);
    return Promise.resolve(new_comment);
  }

  async findAll(param: CommentQueryModel): Promise<Array<CommentDTO>> {
    const comments: Array<CommentDTO> = [];
    for (const comment of this.comments.values()) {
      if (comment.post_id === param.post_id)
        comments.push({
          comment_id: comment.comment_id,
          comment: comment.comment,
          timestamp: comment.timestamp,
          owner_id: comment.owner_id,
          post_id: comment.post_id
        });
    }
    return Promise.resolve(comments);
  }
}
