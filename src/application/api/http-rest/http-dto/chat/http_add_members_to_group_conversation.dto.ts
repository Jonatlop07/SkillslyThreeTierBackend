import { IsArray } from 'class-validator';

export class AddMembersToGroupConversationDTO {
  @IsArray() members_to_add: Array<string>;
}
