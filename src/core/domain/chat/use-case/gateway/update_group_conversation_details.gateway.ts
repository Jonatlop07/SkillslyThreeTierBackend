import Update from '@core/common/persistence/update';
import BelongsUserToChatConversationGateway
  from '@core/domain/chat/use-case/gateway/belongs_user_to_chat_conversation.gateway';
import { ConversationDTO } from '../persistence-dto/conversation.dto';

export default interface UpdateGroupConversationDetailsGateway
  extends BelongsUserToChatConversationGateway, Update<ConversationDTO> {}
