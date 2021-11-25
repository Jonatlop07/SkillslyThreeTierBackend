import Exists from '@core/common/persistence/exists';
import { ConversationDTO } from '@core/domain/chat/use-case/persistence-dto/conversation.dto';

export default interface BelongsUserToChatConversationGateway extends Exists<ConversationDTO>{
  belongsUserToConversation(user_id: string, conversation_id: string): Promise<boolean>
}
