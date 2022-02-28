import { Id } from '@core/common/type/common_types';

export default interface CreateProjectPersistenceDTO {
  owner_id: Id;
  title: string;
  members: Array<Id>;
  description: string;
  reference: string;
  reference_type: string;
  annexes: Array<string>;
}
