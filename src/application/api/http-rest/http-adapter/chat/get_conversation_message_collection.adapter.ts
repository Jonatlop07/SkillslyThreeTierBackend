import { ChatMessageResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_message_response.dto';
import { ChatMessageCollectionResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_message_collection_response.dto';
import GetChatMessageCollectionOutputModel
  from '@core/domain/chat/use-case/output-model/get_chat_message_collection.output_model';
import { MessageDTO } from '@core/domain/chat/use-case/persistence-dto/message.dto';
import { PaginationDTO } from '@application/api/http-rest/http-dto/http_pagination.dto';
import GetChatMessageCollectionInputModel
  from '@core/domain/chat/use-case/input-model/get_chat_message_collection.input_model';

export class GetConversationMessageCollectionAdapter {
  public static toInputModel(
    user_id: string,
    conversation_id: string,
    pagination: PaginationDTO
  ): GetChatMessageCollectionInputModel {
    return {
      user_id,
      conversation_id,
      pagination: {
        limit: pagination.limit,
        offset: pagination.offset
      }
    };
  }

  private static toMessageResponseDTO(message: MessageDTO): ChatMessageResponseDTO {
    return {
      owner_id: message.owner_id,
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
