import { Inject, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import {
  HttpJwtPayload,
  HttpUserPayload
} from '@application/api/http-rest/authentication/types/http_authentication_types';
import { JwtService } from '@nestjs/jwt';
import TwoFactorAuthGateway from '@core/domain/user/use-case/gateway/two_factor_auth.gateway';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class HttpTwoFactorAuthService {
  constructor(
    private readonly config_service: ConfigService,
    @Inject(UserDITokens.UserRepository)
    private readonly gateway: TwoFactorAuthGateway,
    private readonly jwt_service: JwtService
  ) {
  }

  public async generateTwoFactorAuthSecret(user_id: string) {
    const user = await this.gateway.findOne({ user_id });
    const secret = authenticator.generateSecret();
    const app_name = this.config_service.get('TWO_FACTOR_AUTHENTICATION_APP_NAME');
    const otp_auth_url = authenticator.keyuri(user.email, app_name, secret);
    await this.gateway.partialUpdate({
      user_id
    }, {
      two_factor_auth_secret: secret
    });
    return {
      otp_auth_url
    };
  }

  public async pipeQRCodeStream(stream: Response, otpPathUrl: string) {
    return await toFileStream(stream, otpPathUrl);
  }

  public async activationOfTwoFactorAuth(user_id: string, status: boolean) {
    return await this.gateway.partialUpdate({
      user_id
    }, {
      is_two_factor_auth_enabled: status
    });
  }

  public async isValidTwoFactorAuthCode(user_id: string, code: string) {
    const { two_factor_auth_secret } = await this.gateway.findOne({ user_id });
    return authenticator.verify({
      token: code,
      secret: two_factor_auth_secret
    });
  }

  public login(user: HttpUserPayload, is_two_factor_authenticated: boolean) {
    const payload: HttpJwtPayload = { id: user.id, is_two_factor_authenticated };
    const access_token = this.jwt_service.sign(payload);
    return {
      id: user.id,
      customer_id: user.customer_id,
      email: user.email,
      roles: user.roles,
      access_token: access_token,
      is_two_factor_auth_enabled: user.is_two_factor_auth_enabled
    };
  }
}
