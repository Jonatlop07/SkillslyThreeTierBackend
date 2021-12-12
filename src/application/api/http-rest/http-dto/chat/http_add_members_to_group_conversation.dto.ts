import { IsArray } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class AddMembersToGroupConversationDTO {
  @IsArray() @ApiModelProperty() members_to_add: Array<string>;
}
