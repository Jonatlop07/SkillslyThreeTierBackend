import { IsBoolean, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ObtainSpecialRolesDTO {
  @IsBoolean() @ApiModelProperty() obtain_investor_role: boolean;
  @IsBoolean() @ApiModelProperty() obtain_requester_role: boolean;
  @IsString() @ApiModelProperty() payment_method_id: string;
}
