import GetChatMessageCollectionOutputModel
  from '@core/domain/chat/use-case/output-model/get_chat_message_collection.output_model';
import {
  ChatMessageCollectionResponseDTO,
  ChatMessageResponseDTO
} from '@application/api/http-rest/http-dtos/http_chat.dto';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';

export class GetConversationMessageCollectionAdapter {
  private static toMessageResponseDTO(message: MessageDTO): ChatMessageResponseDTO {
    return {
      user_id: message.user_id,
      content: message.content,
      created_at: message.created_at
    };
  }

  public static toResponseDTO(payload: GetChatMessageCollectionOutputModel): ChatMessageCollectionResponseDTO {
    return {
      messages: payload.messages.map(message => this.toMessageResponseDTO(message))
    };
  }
}
