import { Id } from '@core/common/type/common_types';

export default interface DeleteProjectInputModel {
  project_id: Id;
  owner_id?: Id;
}
