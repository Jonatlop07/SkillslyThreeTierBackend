export default interface AddReactionOutputModel {
  post_id: string;
  post_owner_id: string;
  reactor_id: string;
  reaction_type: string;
  added: boolean;
}
