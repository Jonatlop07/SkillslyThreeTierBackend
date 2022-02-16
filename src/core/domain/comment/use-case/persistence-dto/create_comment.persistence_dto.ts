import { Id } from '@core/common/type/common_types';

export default interface CreateCommentPersistenceDTO {
  ownerID: Id;
  postID: Id;
  comment: string;
  timestamp: string;
}
