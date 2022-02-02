import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HttpJwtPayload,
  HttpUserPayload,
} from '@application/api/http-rest/authentication/types/http_authentication_types';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/service/http_authentication.service';

@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger(HttpJwtStrategy.name);

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

  public async validate(payload: HttpJwtPayload): Promise<HttpUserPayload> {
    const user = await this.auth_service.getUser(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { user_id, customer_id, email, roles } = user;
    return {
      id: user_id,
      customer_id,
      email,
      roles
    };
  }
}
