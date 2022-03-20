import { Id } from '@core/common/type/common_types';

export default interface CreateCommentPersistenceDTO {
  owner_id: Id;
  post_id: Id;
  comment: string;
  timestamp: string;
}
