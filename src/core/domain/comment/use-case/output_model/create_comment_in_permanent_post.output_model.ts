import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';

export default interface CreateCommentInPermanentPostOutputModel {
  created_comment: CommentDTO;
}
