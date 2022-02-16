import Create from '@core/common/persistence/create/create';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';
import CreateConversationPersistenceDTO
  from '@core/domain/chat/use-case/persistence-dto/create_conversation.persistence_dto';

export default interface CreateGroupChatConversationGateway
  extends Create<CreateConversationPersistenceDTO, ConversationDTO> {}
