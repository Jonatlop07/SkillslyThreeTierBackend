export default interface ExistsSimpleConversationWithUser {
  existsSimpleConversationWithUser(user_id: string, other_user_id: string): Promise<boolean>
}
