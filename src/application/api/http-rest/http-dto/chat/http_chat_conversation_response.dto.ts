import { IsArray, IsString } from 'class-validator';
import { ChatMessageResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_message_response.dto';

export class ChatConversationResponseDTO {
  @IsString() conversation_id: string;
  @IsString() name: string;
  @IsArray() members: Array<string>;
  @IsArray() messages: Array<ChatMessageResponseDTO>;
  @IsArray() created_at: string;
}
