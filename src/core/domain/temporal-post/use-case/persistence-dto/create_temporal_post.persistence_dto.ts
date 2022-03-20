import { Id } from '@core/common/type/common_types';

export default interface CreateTemporalPostPersistenceDTO {
  description?: string;
  reference: string;
  referenceType: string;
  owner_id: Id;
}
