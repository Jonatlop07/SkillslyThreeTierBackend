export interface MessageDTO {
  message_id?: string;
  conversation_id: string;
  owner_id: string;
  content: string;
  created_at?: string;
}
