import { IsArray, IsString } from 'class-validator';
import { ChatMessageResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_message_response.dto';

export class ChatConversationResponseDTO {
  @IsString() conversation_id: string;
  @IsString() conversation_name: string;
  @IsArray() conversation_members: Array<string>;
  @IsArray() messages: Array<ChatMessageResponseDTO>;
  @IsArray() created_at: string;
}
