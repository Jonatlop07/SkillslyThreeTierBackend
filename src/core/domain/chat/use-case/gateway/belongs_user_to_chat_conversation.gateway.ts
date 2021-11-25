export default interface BelongsUserToChatConversationGateway {
  belongsUserToConversation(user_id: string, conversation_id: string): Promise<boolean>
}
