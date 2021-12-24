import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNumber, IsString } from 'class-validator';

export class CreateEventDTO {
  @IsString() @ApiModelProperty() name: string;
  @IsString() @ApiModelProperty() description: string;
  @IsNumber() @ApiModelProperty() lat: number;
  @IsNumber() @ApiModelProperty() long: number;
  @IsString() @ApiModelProperty() date: Date;
}
