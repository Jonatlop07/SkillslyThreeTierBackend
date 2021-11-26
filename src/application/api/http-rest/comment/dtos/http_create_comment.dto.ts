import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateCommentDto {
  @IsString() @ApiModelProperty()comment: string;
  @IsString() @ApiModelProperty()timestamp: string;

}
