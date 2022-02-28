import { CommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment.dto';

export interface GetCommentsInPermanentPostOutputModel {
  comments: Array<CommentDTO>;
}
