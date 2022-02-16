import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';
import ConversationQueryModel from '@core/domain/chat/use-case/query-model/conversation.query_model';
import FindAll from '@core/common/persistence/find/find_all';

export default interface GetChatConversationCollectionGateway extends FindAll<ConversationQueryModel, ConversationDetailsDTO> {}
