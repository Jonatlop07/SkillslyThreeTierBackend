import BelongsUserToChatConversationGateway from './belongs_user_to_chat_conversation.gateway';
import { ConversationDTO } from '../persistence-dto/conversation.dto';
import ConversationQueryModel from '../query-model/conversation.query_model';
import IsAdministratorOfTheGroupConversation
  from '@core/domain/chat/use-case/persistence/is_administrator_of_the_group_conversation';
import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';
import FindOne from '@core/common/persistence/find_one';
import Delete from '@core/common/persistence/delete';

export default interface DeleteChatGroupConversationGateway
  extends
    FindOne<ConversationQueryModel, ConversationDetailsDTO>,
    BelongsUserToChatConversationGateway,
    IsAdministratorOfTheGroupConversation,
    Delete<ConversationQueryModel, ConversationDTO> {}
