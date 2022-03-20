import { CommentOfCommentDTO } from '@core/domain/comment/use-case/persistence-dto/comment_of_comment.dto';

export interface GetCommentsInCommentOutputModel {
  comments: Array<CommentOfCommentDTO>;
}
