import Create from '@core/common/persistence/create';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';
import BelongsUserToConversation from '@core/domain/chat/use-case/persistence/belongs_user_to_conversation';

export default interface CreateChatMessageGateway extends Create<MessageDTO>, BelongsUserToConversation {}
