import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreatePrivateChatConversationDTO {
  @IsString() @ApiModelProperty() partner_id: string;
}
