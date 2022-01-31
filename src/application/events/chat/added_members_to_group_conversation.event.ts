import { ConversationDetailsDTO } from '@core/domain/chat/use-case/persistence-dto/conversation_details.dto';

interface AddedMembersToGroupConversationPayload {
  conversation: ConversationDetailsDTO;
}

export class AddedMembersToGroupConversationEvent{
  public readonly conversation: ConversationDetailsDTO;

  constructor(private readonly payload: AddedMembersToGroupConversationPayload) {
    this.conversation = payload.conversation;
  }
}
