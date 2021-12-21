import { ChatConversationResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_conversation_response.dto';
import { CreateGroupChatConversationDTO } from '@application/api/http-rest/http-dto/chat/http_create_group_chat_conversation_dto';
import CreateGroupChatConversationInputModel
  from '@core/domain/chat/use-case/input-model/create_group_chat_conversation.input_model';
import CreateGroupChatConversationOutputModel
  from '@core/domain/chat/use-case/output-model/create_group_chat_conversation.output_model';
import { ChatMessageResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_message_response.dto';

export class CreateGroupChatConversationAdapter {
  public static toResponseDTO(payload: CreateGroupChatConversationOutputModel): ChatConversationResponseDTO {
    const { conversation_id, name, members, messages, created_at } = payload;
    return {
      conversation_id,
      conversation_name: name,
      conversation_members: members,
      messages: messages as Array<ChatMessageResponseDTO>,
      created_at
    };
  }

  public static toInputModel(
    payload: CreateGroupChatConversationDTO,
    creator_id: string
  ): CreateGroupChatConversationInputModel {
    return {
      creator_id,
      conversation_name: payload.name,
      conversation_members: payload.members
    };
  }
}
