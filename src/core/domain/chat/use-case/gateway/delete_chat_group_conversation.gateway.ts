import Delete from '@core/common/persistence/delete';
import BelongsUserToChatConversationGateway from './belongs_user_to_chat_conversation.gateway';
import { ConversationDTO } from '../persistence-dto/conversation.dto';
import ConversationQueryModel from '../query-model/conversation.query_model';

export default interface DeleteChatGroupConversationGateway
  extends BelongsUserToChatConversationGateway, Delete<ConversationDTO, ConversationQueryModel> {}
