export interface MessageDTO {
  message_id?: string;
  conversation_id: string;
  user_id: string;
  content: string;
  created_at?: string;
}
