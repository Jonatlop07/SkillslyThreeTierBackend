import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';


export class DeleteTemporalPostDTO {
  @IsString() @ApiModelProperty() temporal_post_id: string;
  @IsString() @ApiModelProperty() user_id: string;
}
