import UpdateGroupConversationDetailsOutputModel
  from '@core/domain/chat/use-case/output-model/update_group_conversation_details.output_model';

export class UpdateGroupConversationDetailsAdapter {
  public static toResponseDTO(payload: UpdateGroupConversationDetailsOutputModel) {
    return {
      conversation_name: payload.conversation_name
    };
  }
}
