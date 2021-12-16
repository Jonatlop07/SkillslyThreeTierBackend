import { ChatMessageResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_message_response.dto';
import { ChatMessageCollectionResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_message_collection_response.dto';
import GetChatMessageCollectionOutputModel
  from '@core/domain/chat/use-case/output-model/get_chat_message_collection.output_model';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';

export class GetConversationMessageCollectionAdapter {
  private static toMessageResponseDTO(message: MessageDTO): ChatMessageResponseDTO {
    return {
      user_id: message.user_id,
      content: message.content,
      created_at: message.created_at,
      message_id: message.message_id
    };
  }

  public static toResponseDTO(payload: GetChatMessageCollectionOutputModel): ChatMessageCollectionResponseDTO {
    return {
      messages: payload.messages.map(message => this.toMessageResponseDTO(message))
    };
  }
}
