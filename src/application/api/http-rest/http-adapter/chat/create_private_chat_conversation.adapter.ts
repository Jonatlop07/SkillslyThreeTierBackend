import { ChatConversationResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_conversation_response.dto';
import CreatePrivateChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_private_chat_conversation.output_model';
import { ChatMessageResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_message_response.dto';

export class CreatePrivateChatConversationAdapter {
  public static toResponseDTO(payload: CreatePrivateChatConversationOutputModel): ChatConversationResponseDTO {
    const { conversation_id, name, members, messages, created_at } = payload.created_private_chat_conversation;
    return {
      conversation_id,
      conversation_name: name,
      conversation_members: members,
      messages: messages as Array<ChatMessageResponseDTO>,
      created_at
    };
  }
}
