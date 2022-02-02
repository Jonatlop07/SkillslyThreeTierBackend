import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UpdateUserAccountDTO {
  @IsEmail()
  @ApiModelProperty()
  public readonly email: string;

  @ApiModelProperty()
  public password: string;

  @IsString()
  @ApiModelProperty()
  public name: string;

  @IsString()
  @ApiModelProperty()
  public date_of_birth: string;

  @IsBoolean()
  @ApiModelProperty()
  public is_two_factor_auth_enabled: boolean;
}
