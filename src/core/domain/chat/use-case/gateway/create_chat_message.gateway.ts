import Create from '@core/common/persistence/create';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';

export default interface CreateChatMessageGateway extends Create<MessageDTO> {}
