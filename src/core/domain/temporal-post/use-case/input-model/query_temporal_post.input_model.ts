import { Id } from '@core/common/type/common_types';

export default interface QueryTemporalPostInputModel {
  temporal_post_id: Id;
  owner_id?: Id;
}
