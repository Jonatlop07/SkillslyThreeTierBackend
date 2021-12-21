import Update from '@core/common/persistence/update';
import BelongsUserToChatConversationGateway
  from '@core/domain/chat/use-case/gateway/belongs_user_to_chat_conversation.gateway';
import { ConversationDTO } from '../persistence-dto/conversation.dto';
import IsAdministratorOfTheGroupConversation
  from '@core/domain/chat/use-case/persistence/is_administrator_of_the_group_conversation';

export default interface UpdateGroupConversationDetailsGateway
  extends BelongsUserToChatConversationGateway,
    IsAdministratorOfTheGroupConversation,
    Update<ConversationDTO> {}
