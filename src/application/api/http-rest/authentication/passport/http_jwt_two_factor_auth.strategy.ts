import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  HttpJwtPayload,
  HttpUserPayload
} from '@application/api/http-rest/authentication/types/http_authentication_types';
import { ConfigService } from '@nestjs/config';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/service/http_authentication.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class HttpJwtTwoFactorAuthStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
  constructor(
    private readonly config_service: ConfigService,
    private readonly auth_service: HttpAuthenticationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config_service.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: HttpJwtPayload): Promise<HttpUserPayload> {
    const user = await this.auth_service.getUser(payload.id);
    if (!user)
      throw new UnauthorizedException();
    const {
      user_id, customer_id, email, roles,
      is_two_factor_auth_enabled
    } = user;
    const http_user_payload: HttpUserPayload = {
      id: user_id,
      customer_id,
      email,
      roles,
      is_two_factor_auth_enabled
    };
    if (!is_two_factor_auth_enabled)
      return http_user_payload;
    if (payload.is_two_factor_authenticated)
      return http_user_payload;
  }
}
