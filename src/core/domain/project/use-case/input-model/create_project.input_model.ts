export default interface CreateProjectInputModel {
  user_id: string;
  id?: string;
  title: string;
  members: Array<string>;
  description: string;
  reference: string;
  reference_type: string;
  annexes: Array<string>;
}
