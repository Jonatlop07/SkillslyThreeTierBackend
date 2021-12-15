import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UpdateGroupConversationDetailsDTO {
  @IsString() @ApiModelProperty() conversation_name: string;
}
