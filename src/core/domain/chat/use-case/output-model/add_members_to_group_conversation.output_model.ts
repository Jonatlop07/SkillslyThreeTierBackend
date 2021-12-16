import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';

export default interface AddMembersToGroupConversationOutputModel {
  added_members: Array<{ user_id: string; name: string; }>;
  conversation: ConversationDetailsDTO
}
