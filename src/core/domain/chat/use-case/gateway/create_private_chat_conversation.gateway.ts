import Create from '@core/common/persistence/create';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
import ExistsPrivateConversationWithUser
  from '@core/domain/chat/use-case/persistence/exists_private_conversation_with_user';

export default interface CreatePrivateChatConversationGateway
  extends Create<ConversationDTO>, ExistsPrivateConversationWithUser {}
