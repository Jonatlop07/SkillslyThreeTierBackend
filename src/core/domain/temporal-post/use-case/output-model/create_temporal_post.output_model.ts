import { Id } from '@core/common/type/common_types';

export default interface CreateTemporalPostOutputModel {
  temporal_post_id: Id;
  owner_id: Id;
  description: string;
}
