import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TwoFactorAuthenticationDTO {
  @IsString() @ApiProperty() code: string;
}
