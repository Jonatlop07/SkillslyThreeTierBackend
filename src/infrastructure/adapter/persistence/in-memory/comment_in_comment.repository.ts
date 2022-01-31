import CommentInCommentRepository from '@core/domain/comment/use-case/repository/comment_in_comment.repository';
import { CommentOfCommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment_of_comment.dto';


export class CommentInCommentInMemoryRepository implements CommentInCommentRepository {
  private currently_available_comment_id: string;

  constructor(private readonly comments: Map<string, CommentOfCommentDTO>) {
    this.currently_available_comment_id = '1';
  }

  async create(comment: CommentOfCommentDTO): Promise<CommentOfCommentDTO> {
    const new_comment: CommentOfCommentDTO = {
      comment_id: this.currently_available_comment_id,
      comment: comment['comment'],
      timestamp: comment['timestamp'],
      ancestorCommentID: comment['ancestorCommentID'],
      userID: comment['userID'],
    };
    this.comments.set(this.currently_available_comment_id, new_comment);
    this.currently_available_comment_id = String(Number(this.currently_available_comment_id) + 1);
    return Promise.resolve(new_comment);
  }

  //
  // async findAll(): Promise<Array<GetCommentsInPermanentPostOutputModel>> {
  //   const comments: Array<GetCommentsInPermanentPostOutputModel> = [];
  //   for (const comment of this.comments.values()) {
  //     comments.push({
  //       id: comment.comment_id,
  //       comment: comment.comment,
  //       timestamp: comment.timestamp,
  //       email: comment.userID,
  //       name: '',
  //     });
  //   }
  //   return Promise.resolve(comments);
  // }
  //
  // findOne() {
  //   return null;
  // }
  //
  // findAllWithRelation() {
  //   return null;
  // }


}