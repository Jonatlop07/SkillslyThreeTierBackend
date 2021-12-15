export default interface ExitGroupConversation {
  exit(user_id: string, conversation_id: string): Promise<void>;
}
