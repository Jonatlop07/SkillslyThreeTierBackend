import { Id } from '@core/common/type/common_types';

export interface ProjectDTO {
  owner_id?: Id;
  project_id?: Id;
  created_at?: string;
  updated_at?: string;
  user_name?: string;
  title: string;
  members: Array<string>;
  description: string;
  reference: string;
  reference_type: string;
  annexes: Array<string>;
}
