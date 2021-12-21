export default interface IsAdministratorOfTheGroupConversation {
  isAdministratorOfTheGroupConversation(user_id: string, conversation_id: string): Promise<boolean>;
}
