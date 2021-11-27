import CreateSimpleChatConversationGateway
  from '@core/domain/chat/use-case/gateway/create_simple_chat_conversation.gateway';
import CreateGroupChatConversationGateway
  from '@core/domain/chat/use-case/gateway/create_group_chat_conversation.gateway';
import BelongsUserToChatConversationGateway
  from '@core/domain/chat/use-case/gateway/belongs_user_to_chat_conversation.gateway';

export default interface ChatConversationRepository
  extends CreateSimpleChatConversationGateway,
  CreateGroupChatConversationGateway, BelongsUserToChatConversationGateway {}
