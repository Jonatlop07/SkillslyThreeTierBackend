import { Id } from '@core/common/type/common_types';

export default interface QueryPermanentPostCollectionInputModel {
  user_id: Id;
  owner_id?: Id;
  group_id?: Id;
  limit?: string;
  offset?: string;
}
