import { Strategy } from 'passport-local';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/http_authentication.service';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';

@Injectable()
export class HttpLocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger(HttpLocalStrategy.name);

  constructor(private authentication_service: HttpAuthenticationService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(username: string, password: string): Promise<HttpUserPayload> {
    this.logger.log(username, password);
    const user = await this.authentication_service.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
