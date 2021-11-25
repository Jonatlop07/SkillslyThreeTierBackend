import ChatConversationRepository from '@core/domain/chat/use-case/repository/chat_conversation.repository';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';

export class ChatConversationInMemoryRepository implements ChatConversationRepository {
  constructor(private readonly conversations: Map<string, ConversationDTO>) {
  }

  create(t: ConversationDTO): Promise<ConversationDTO> {
    return Promise.resolve(undefined);
  }

  belongsUserToConversation(user_id: string, conversation_id: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
