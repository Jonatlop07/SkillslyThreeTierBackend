import { Message } from '@core/domain/chat/entity/message';

export interface ConversationDTO {
  conversation_id?: string;
  name?: string;
  members: Array<string>;
  messages: Array<Message>;
  created_at?: string;
}
