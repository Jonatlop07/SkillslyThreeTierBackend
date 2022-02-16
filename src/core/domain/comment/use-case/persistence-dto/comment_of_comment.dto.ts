import { Id } from '@core/common/type/common_types';

export interface CommentOfCommentDTO{
  comment_id?: Id;
  comment: string;
  timestamp: string;
  userID?: Id;
  ancestorCommentID?: string;
}
