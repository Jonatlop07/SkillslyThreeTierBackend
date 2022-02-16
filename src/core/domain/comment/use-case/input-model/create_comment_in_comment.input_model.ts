import { Id } from '@core/common/type/common_types';

export default interface CreateCommentInCommentInputModel {
  ancestor_comment_id: Id;
  owner_id: Id;
  comment: string;
  timestamp: string;
}
