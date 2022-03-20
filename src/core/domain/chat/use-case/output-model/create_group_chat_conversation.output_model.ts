import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';

export default interface CreateGroupChatConversationOutputModel {
  created_group_chat_conversation: ConversationDTO;
}
