import ChatConversationRepository from '@core/domain/chat/use-case/repository/chat_conversation.repository';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
import * as moment from 'moment';

export class ChatConversationInMemoryRepository implements ChatConversationRepository {
  private currently_available_conversation_id: string;

  constructor(private readonly conversations: Map<string, ConversationDTO>) {
    this.currently_available_conversation_id = '1';
  }

  create(conversation: ConversationDTO): Promise<ConversationDTO> {
    const new_conversation: ConversationDTO = {
      conversation_id: this.currently_available_conversation_id,
      name: conversation.name,
      members: conversation.members,
      messages: conversation.messages,
      created_at: moment().local().format('YYYY/MM/DD HH:mm:ss')
    };
    this.conversations.set(this.currently_available_conversation_id, new_conversation);
    this.currently_available_conversation_id = `${Number(this.currently_available_conversation_id) + 1}`;
    return Promise.resolve(new_conversation);
  }

  belongsUserToConversation(user_id: string, conversation_id: string): Promise<boolean> {
    const conversation = this.conversations.get(conversation_id);
    return Promise.resolve(user_id in conversation.members);
  }

  existsSimpleConversationWithUser(user_id: string, other_user_id: string): Promise<boolean> {
    for (const conversation of this.conversations.values()) {
      if (user_id in conversation.members && other_user_id in conversation.members)
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  exists(conversation: ConversationDTO): Promise<boolean> {
    return this.existsById(conversation.conversation_id);
  }

  existsById(id: string): Promise<boolean> {
    for (const _conversation of this.conversations.values())
      if (_conversation.conversation_id === id)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }
}
