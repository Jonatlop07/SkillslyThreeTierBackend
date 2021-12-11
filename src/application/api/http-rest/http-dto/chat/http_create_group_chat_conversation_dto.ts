import { IsArray, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateGroupChatConversationDTO {
  @IsString() @ApiModelProperty() name: string;
  @IsArray() @ApiModelProperty() members: Array<string>;
}
