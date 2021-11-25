import ChatMessageRepository from '@core/domain/chat/use-case/repository/chat_message.repository';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';

export class ChatMessageInMemoryRepository implements ChatMessageRepository {
  constructor(private readonly messages: Map<string, MessageDTO>) {
  }
}
