import { CommentOfCommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment_of_comment.dto';

export default interface CreateCommentInCommentOutputModel {
  created_comment: CommentOfCommentDTO;
}
