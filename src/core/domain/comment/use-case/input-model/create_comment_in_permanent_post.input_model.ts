import { Id } from '@core/common/type/common_types';

export default interface CreateCommentInPermanentPostInputModel {
  ownerID: Id;
  postID: Id;
  comment: string;
  timestamp: string;
}
