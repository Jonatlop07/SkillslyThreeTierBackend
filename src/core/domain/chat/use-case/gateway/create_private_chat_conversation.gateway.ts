import Create from '@core/common/persistence/create';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
import ExistsPrivateConversationWithUser
  from '@core/domain/chat/use-case/persistence/exists_private_conversation_with_user';
import CreateConversationPersistenceDTO
  from '@core/domain/chat/use-case/persistence-dto/create_conversation.persistence_dto';

export default interface CreatePrivateChatConversationGateway
  extends Create<CreateConversationPersistenceDTO, ConversationDTO>, ExistsPrivateConversationWithUser {}
