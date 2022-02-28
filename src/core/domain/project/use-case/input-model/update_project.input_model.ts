import { Id } from '@core/common/type/common_types';

export default interface UpdateProjectInputModel {
  owner_id: Id;
  project_id?: Id;
  title: string;
  members: Array<string>;
  description: string;
  reference: string;
  reference_type: string;
  annexes: Array<string>;
}
