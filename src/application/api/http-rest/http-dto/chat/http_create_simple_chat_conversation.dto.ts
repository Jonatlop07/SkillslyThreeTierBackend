import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateSimpleChatConversationDTO {
  @IsString() @ApiModelProperty() partner_id: string;
}
