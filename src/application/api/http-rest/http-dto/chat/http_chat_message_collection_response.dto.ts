import { IsArray } from 'class-validator';
import { ChatMessageResponseDTO } from '@application/api/http-rest/http-dto/chat/http_chat_message_response.dto';

export class ChatMessageCollectionResponseDTO {
  @IsArray() messages: Array<ChatMessageResponseDTO>;
}
