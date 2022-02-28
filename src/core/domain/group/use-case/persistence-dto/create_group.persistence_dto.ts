import { Id } from '@core/common/type/common_types';

export default interface CreateGroupPersistenceDTO {
  owner_id: Id;
  name: string;
  description: string;
  category: string;
  picture?: string
}
