import { Id } from '@core/common/type/common_types';

export interface CommentDTO {
  comment_id?: Id;
  comment: string;
  timestamp: string;
  owner_id: Id;
  post_id: Id;
}
