import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';

export default interface GetChatConversationCollectionOutputModel {
  conversations: Array<ConversationDetailsDTO>
}
