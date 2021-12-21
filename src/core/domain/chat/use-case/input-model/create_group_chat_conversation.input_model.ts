export default interface CreateGroupChatConversationInputModel {
  creator_id: string;
  conversation_name: string;
  conversation_members: Array<string>;
}
