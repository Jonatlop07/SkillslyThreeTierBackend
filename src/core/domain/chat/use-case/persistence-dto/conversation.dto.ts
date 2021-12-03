import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';

export interface ConversationDTO {
  conversation_id?: string;
  name?: string;
  members: Array<string>;
  messages: Array<MessageDTO>;
  created_at?: string;
}
