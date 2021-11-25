import {
  ChatConversationResponseDTO
} from '@application/api/http-rest/profile/dtos/http_chat.dto';
import CreateSimpleChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_simple_chat_conversation.output_model';

export class CreateSimpleChatConversationAdapter {
  public static toResponseDTO(payload: CreateSimpleChatConversationOutputModel): ChatConversationResponseDTO {
    return payload as ChatConversationResponseDTO;
  }
}
