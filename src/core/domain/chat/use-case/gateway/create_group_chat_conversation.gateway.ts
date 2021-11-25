import Create from '@core/common/persistence/create';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';

export default interface CreateGroupChatConversationGateway extends Create<ConversationDTO> {}
