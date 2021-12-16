export type CreateGroupEntityPayload = {
  id?: string;
  owner_id: string;
  name: string;
  description: string;
  category: string;
  picture?: string;
};