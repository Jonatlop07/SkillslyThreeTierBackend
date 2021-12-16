import AddMembersToGroupConversationOutputModel
  from '@core/domain/chat/use-case/output-model/add_members_to_group_conversation.output_model';
import { AddMembersToGroupConversationResponseDTO } from '@application/api/http-rest/http-dto/chat/http_add_members_to_group_conversation_response.dto';

export class AddMembersToGroupConversationAdapter {
  public static toResponseDTO(payload: AddMembersToGroupConversationOutputModel): AddMembersToGroupConversationResponseDTO {
    return {
      added_members: payload.added_members
    };
  }
}
