import { IsString } from 'class-validator';

export class ChatMessageResponseDTO {
  @IsString() message_id: string;
  @IsString() user_id: string;
  @IsString() content: string;
  @IsString() created_at: string;
}


