import CommentRepository from '@core/domain/comment/use-case/repository/comment.repository';
import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';

export class CommentInMemoryRepository implements CommentRepository {
  private currently_available_comment_id: string;

  constructor(private readonly comments: Map<string, CommentDTO>) {
    this.currently_available_comment_id = '1';
  }

  async create(comment: CommentDTO): Promise<CommentDTO> {
    const new_comment: CommentDTO = {
      comment_id: this.currently_available_comment_id,
      comment: comment['comment'],
      timestamp: comment['timestamp'],
      postID: comment['postID'],
      userID: comment['userID'],
    };
    this.comments.set(this.currently_available_comment_id, new_comment);
    this.currently_available_comment_id = String(Number(this.currently_available_comment_id) + 1);
    return Promise.resolve(new_comment);
  }

  async get(): Promise<Array<CommentDTO>>{
    return Promise.resolve(Array.from(this.comments.values()));
  }

}