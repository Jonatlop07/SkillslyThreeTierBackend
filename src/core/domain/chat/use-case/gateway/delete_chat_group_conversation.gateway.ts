import Delete from '@core/common/persistence/delete';
import BelongsUserToChatConversationGateway from './belongs_user_to_chat_conversation.gateway';
import { ConversationDTO } from '../persistence-dto/conversation.dto';
import ConversationQueryModel from '../query-model/conversation.query_model';
import IsAdministratorOfTheGroupConversation
  from '@core/domain/chat/use-case/persistence/is_administrator_of_the_group_conversation';
import Find from '@core/common/persistence/find';
import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';

export default interface DeleteChatGroupConversationGateway
  extends
    Find<ConversationDetailsDTO, ConversationQueryModel>,
    BelongsUserToChatConversationGateway,
    IsAdministratorOfTheGroupConversation,
    Delete<ConversationDTO, ConversationQueryModel> {}
