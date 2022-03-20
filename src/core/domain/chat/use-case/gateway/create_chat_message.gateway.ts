import Create from '@core/common/persistence/create';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';
import CreateMessagePersistenceDTO from '@core/domain/chat/use-case/persistence-dto/create_message.persistence_dto';

export default interface CreateChatMessageGateway
  extends Create<CreateMessagePersistenceDTO, MessageDTO> {}
