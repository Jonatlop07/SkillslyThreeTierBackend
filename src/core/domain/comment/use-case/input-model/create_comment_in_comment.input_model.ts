import { Id } from '@core/common/type/common_types';

export default interface CreateCommentInCommentInputModel {
  ancestorCommentID: Id;
  userID: Id;
  comment: string;
  timestamp: string;
}
