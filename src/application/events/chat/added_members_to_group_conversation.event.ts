import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';

interface AddedMembersToGroupConversationPayload {
  user_id: string;
  conversation: ConversationDetailsDTO;
}

export class AddedMembersToGroupConversationEvent{
  public readonly user_id: string;
  public readonly conversation: ConversationDetailsDTO;

  constructor(private readonly payload: AddedMembersToGroupConversationPayload) {
    this.user_id = payload.user_id;
    this.conversation = payload.conversation;
  }
}
