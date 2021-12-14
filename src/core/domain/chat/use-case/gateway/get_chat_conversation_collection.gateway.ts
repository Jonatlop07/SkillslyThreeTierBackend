import Find from '@core/common/persistence/find';
import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';
import ConversationQueryModel from '@core/domain/chat/use-case/query-model/conversation.query_model';

export default interface GetChatConversationCollectionGateway extends Find<ConversationDetailsDTO, ConversationQueryModel> {}
