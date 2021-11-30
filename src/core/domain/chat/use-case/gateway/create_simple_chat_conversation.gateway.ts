import Create from '@core/common/persistence/create';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
import ExistsSimpleConversationWithUser
  from '@core/domain/chat/use-case/persistence/exists_simple_conversation_with_user';

export default interface CreateSimpleChatConversationGateway
  extends Create<ConversationDTO>, ExistsSimpleConversationWithUser {}
