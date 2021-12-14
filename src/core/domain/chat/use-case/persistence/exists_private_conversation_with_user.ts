export default interface ExistsPrivateConversationWithUser {
  existsPrivateConversationWithUser(user_id: string, other_user_id: string): Promise<boolean>
}
