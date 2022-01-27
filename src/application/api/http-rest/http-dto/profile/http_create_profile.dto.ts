import { IsArray, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateProfileDto {
  @IsString() @ApiModelProperty() resume: string;
  @IsArray() @ApiModelProperty() knowledge: Array<string>;
  @IsArray() @ApiModelProperty() talents: Array<string>;
  @IsArray() @ApiModelProperty() activities: Array<string>;
  @IsArray() @ApiModelProperty() interests: Array<string>;
}
