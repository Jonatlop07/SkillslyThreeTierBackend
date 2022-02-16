import { Id } from '@core/common/type/common_types';

export default interface CreateGroupInputModel {
  owner_id: Id;
  name: string;
  description: string;
  category: string;
  picture?: string
}
