import ConversationQueryModel from '@core/domain/chat/use-case/query-model/conversation.query_model';
import Exists from '@core/common/persistence/exists/exists';

export default interface BelongsUserToChatConversationGateway extends Exists<ConversationQueryModel> {
  belongsUserToConversation(user_id: string, conversation_id: string): Promise<boolean>
}

