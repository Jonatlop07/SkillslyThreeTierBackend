import { IsArray, IsString } from 'class-validator';

export class CreateSimpleChatConversationDTO {
  @IsString() partner_id: string;
}

export class CreateGroupChatConversationDTO {
  @IsString() name: string;
  @IsArray() members: Array<string>;
}

export class ChatConversationResponseDTO {
  @IsString() conversation_id: string;
  @IsString() name: string;
  @IsArray() members: Array<string>;
  @IsArray() messages: Array<ChatMessageResponseDTO>;
  @IsArray() created_at: string;
}

export class ChatMessageResponseDTO {
  @IsString() user_id: string;
  @IsString() content: string;
  @IsString() created_at: string;
}

export class ChatMessageCollectionResponseDTO {
  @IsArray() messages: Array<ChatMessageResponseDTO>;
}
