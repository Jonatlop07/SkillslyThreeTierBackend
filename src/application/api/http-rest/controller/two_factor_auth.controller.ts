import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller, HttpCode, HttpStatus, Logger,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common';
import { Response } from 'express';
import { HttpTwoFactorAuthService } from '@application/api/http-rest/authentication/service/http_two_factor_auth.service';
import { HttpUser } from '@application/api/http-rest/authentication/decorator/http_user';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { TwoFactorAuthenticationDTO } from '@application/api/http-rest/authentication/types/two_factor_authentication.dto';
import { HttpAuth } from '@application/api/http-rest/authentication/decorator/http_auth';

@Controller('2fa')
@ApiTags('Two Factor Authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  private readonly logger: Logger = new Logger(TwoFactorAuthController.name);

  constructor(
    private readonly two_factor_auth_service: HttpTwoFactorAuthService
  ) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @HttpAuth()
  @ApiBearerAuth()
  public async generateQRCode(
    @HttpUser() http_user: HttpUserPayload,
    @Res() response: Response
  ) {
    const { otp_auth_url } = await this.two_factor_auth_service.generateTwoFactorAuthSecret(http_user.id);
    response.setHeader('content-type', 'image/png');
    return this.two_factor_auth_service.pipeQRCodeStream(response, otp_auth_url);
  }

  @Post('turn-on')
  @HttpCode(HttpStatus.OK)
  @HttpAuth()
  @ApiBearerAuth()
  public async activationOfTwoFactorAuth(
    @HttpUser() http_user: HttpUserPayload,
    @Body(ValidationPipe) two_factor_auth_dto: TwoFactorAuthenticationDTO
  ) {
    const is_valid_code = await this.two_factor_auth_service.isValidTwoFactorAuthCode(http_user.id, two_factor_auth_dto.code);
    if (!is_valid_code)
      throw new UnauthorizedException('Invalid authentication code');
    await this.two_factor_auth_service.activationOfTwoFactorAuth(http_user.id, true);
  }

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  @HttpAuth()
  @ApiBearerAuth()
  public authenticate(
    @HttpUser() http_user: HttpUserPayload,
    @Body(ValidationPipe) two_factor_auth_dto: TwoFactorAuthenticationDTO
  ) {
    const is_valid_code = this.two_factor_auth_service.isValidTwoFactorAuthCode(http_user.id, two_factor_auth_dto.code);
    console.log(is_valid_code);
    if (!is_valid_code)
      throw new UnauthorizedException('Invalid authentication code');
    return this.two_factor_auth_service.login(http_user, true);
  }
}
