interface ConversationMemberDetailsDTO {
  member_id: string;
  member_name: string;
}

export interface ConversationDetailsDTO {
  conversation_id: string;
  conversation_members: Array<ConversationMemberDetailsDTO>,
  conversation_name: string;
  is_private: boolean;
}
