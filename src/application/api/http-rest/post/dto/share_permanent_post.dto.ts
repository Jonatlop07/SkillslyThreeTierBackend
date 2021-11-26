import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class SharePermanentPostDTO {
  @IsString() @ApiModelProperty()user_id: string;
}
