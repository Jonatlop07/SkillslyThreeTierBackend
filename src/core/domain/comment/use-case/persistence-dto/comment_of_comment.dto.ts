import { Id } from '@core/common/type/common_types';

export interface CommentOfCommentDTO{
  comment_id?: Id;
  comment: string;
  timestamp: string;
  owner_id: Id;
  ancestor_comment_id: Id;
}
