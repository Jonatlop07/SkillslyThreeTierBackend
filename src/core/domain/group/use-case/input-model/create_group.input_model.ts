
export default interface CreateGroupInputModel {
  id?: string;
  owner_id: string;
  name: string;
  description: string;
  category: string;
  picture?: string
}