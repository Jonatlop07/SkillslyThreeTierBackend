import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ObtainSpecialRolesDTO {
  @IsString() @ApiModelProperty() obtain_investor_role: boolean;
  @IsString() @ApiModelProperty() obtain_requester_role: boolean;
  @IsString() @ApiModelProperty() payment_method_id: string;
}
