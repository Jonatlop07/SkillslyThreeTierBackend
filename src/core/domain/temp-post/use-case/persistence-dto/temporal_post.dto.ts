import { Id } from '@core/common/type/common_types';

export interface TemporalPostDTO {
  temporal_post_id?: Id;
  description?: string;
  reference: string;
  referenceType: string;
  owner_id: Id;
  created_at?: string;
  expires_at?: string;
}
