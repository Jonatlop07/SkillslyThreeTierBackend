import BelongsUserToChatConversationGateway
  from '@core/domain/chat/use-case/gateway/belongs_user_to_chat_conversation.gateway';
import ExitGroupConversation from '@core/domain/chat/use-case/persistence/exit_group_conversation';

export default interface ExitChatGroupConversationGateway
  extends BelongsUserToChatConversationGateway, ExitGroupConversation {}
