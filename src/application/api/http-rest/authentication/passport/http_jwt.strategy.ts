import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HttpJwtPayload,
  HttpUserPayload,
} from '@application/api/http-rest/authentication/types/http_authentication_types';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/http_authentication.service';

@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger(HttpJwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: HttpAuthenticationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  public async validate(payload: HttpJwtPayload): Promise<HttpUserPayload> {
    const user = await this.authService.getUser(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.user_id,
      email: user.email,
    };
  }
}
