import {
  ChatConversationResponseDTO, ChatMessageResponseDTO
} from '@application/api/http-rest/http-dtos/http_chat.dto';
import CreateSimpleChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_simple_chat_conversation.output_model';

export class CreateSimpleChatConversationAdapter {
  public static toResponseDTO(payload: CreateSimpleChatConversationOutputModel): ChatConversationResponseDTO {
    const { conversation_id, name, members, messages, created_at } = payload;
    return {
      conversation_id,
      name,
      members,
      messages: messages as Array<ChatMessageResponseDTO>,
      created_at
    };
  }
}
