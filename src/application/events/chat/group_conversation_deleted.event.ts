interface GroupConversationDeletedPayload {
  conversation_id: string;
  conversation_members: Array<string>;
  user_who_deletes_id: string;
}

export class GroupConversationDeletedEvent {
  public readonly conversation_id: string;
  public readonly conversation_members: Array<string>;
  public readonly user_who_deletes_id: string;

  constructor(payload: GroupConversationDeletedPayload) {
    this.conversation_id = payload.conversation_id;
    this.conversation_members = payload.conversation_members;
    this.user_who_deletes_id = payload.user_who_deletes_id;
  }
}
