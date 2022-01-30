export interface ProjectDTO {
  user_id?: string;
  project_id?: string;
  created_at?: string;
  user_name?: string;
  title: string;
  members: Array<string>;
  description: string;
  reference: string;
  reference_type: string;
  annexes: Array<string>;
}
