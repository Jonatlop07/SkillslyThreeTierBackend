import { IsString } from 'class-validator';

export class ChatMessageResponseDTO {
  @IsString() message_id: string;
  @IsString() owner_id: string;
  @IsString() content: string;
  @IsString() created_at: string;
}


