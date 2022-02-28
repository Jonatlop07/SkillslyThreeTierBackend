import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';

export default interface CreatePrivateChatConversationOutputModel {
  created_private_chat_conversation: ConversationDTO;
}
