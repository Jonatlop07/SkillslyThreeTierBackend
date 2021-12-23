import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateUserAccountDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  public password: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  public date_of_birth: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiModelProperty()
  public is_investor: boolean;
}
