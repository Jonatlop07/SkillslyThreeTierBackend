import { IsArray } from 'class-validator';

export class AddMembersToGroupConversationResponseDTO {
  @IsArray() added_members: Array<{ user_id: string, name: string }>;
}
