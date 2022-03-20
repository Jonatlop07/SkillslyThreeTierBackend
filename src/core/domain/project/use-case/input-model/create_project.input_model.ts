import { Id } from '@core/common/type/common_types';

export default interface CreateProjectInputModel {
  owner_id: Id;
  title: string;
  members: Array<Id>;
  description: string;
  reference: string;
  reference_type: string;
  annexes: Array<string>;
}
