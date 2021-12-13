export default interface AddMembersToGroupConversationInputModel {
  user_id: string;
  conversation_id: string;
  members_to_add: Array<string>;
}
