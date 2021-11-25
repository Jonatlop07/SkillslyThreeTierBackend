import {
  ChatConversationResponseDTO,
  CreateGroupChatConversationDTO
} from '@application/api/http-rest/profile/dtos/http_chat.dto';
import CreateGroupChatConversationInputModel
  from '@core/domain/chat/use-case/input-model/create_group_chat_conversation.input_model';
import CreateGroupChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_group_chat_conversation.output_model';

export class CreateGroupChatConversationAdapter {
  public static toResponseDTO(payload: CreateGroupChatConversationOutputModel): ChatConversationResponseDTO {
    return payload as ChatConversationResponseDTO;
  }

  public static toInputModel(payload: CreateGroupChatConversationDTO): CreateGroupChatConversationInputModel {
    return {
      conversation_name: payload.name,
      conversation_members: payload.members
    };
  }
}
