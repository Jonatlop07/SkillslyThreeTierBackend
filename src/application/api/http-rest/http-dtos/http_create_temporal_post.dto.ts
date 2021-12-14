import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateTemporalPostDTO {
  @IsString() @ApiModelProperty() description?: string;
  @IsString() @ApiModelProperty() reference: string;
  @IsString() @ApiModelProperty() referenceType: string;
}
