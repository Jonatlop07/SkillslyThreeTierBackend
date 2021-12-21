import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';

export interface ConversationDTO {
  creator_id?: string;
  conversation_id?: string;
  name?: string;
  members: Array<string>;
  messages: Array<MessageDTO>;
  created_at?: string;
  is_private?: boolean;
}
