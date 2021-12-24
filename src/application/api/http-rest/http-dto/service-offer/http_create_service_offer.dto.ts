import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateServiceOfferDTO {
  @IsString() @ApiModelProperty() title: string;
  @IsString() @ApiModelProperty() service_brief: string;
  @IsString() @ApiModelProperty() contact_information: string;
  @IsString() @ApiModelProperty() category: string;
}
