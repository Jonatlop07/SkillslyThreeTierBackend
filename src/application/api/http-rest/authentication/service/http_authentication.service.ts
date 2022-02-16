import { BadGatewayException, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import {
  HttpJwtPayload,
  HttpLoggedInUser,
  HttpUserPayload
} from '@application/api/http-rest/authentication/types/http_authentication_types';
import { ValidateCredentialsInteractor } from '@core/domain/user/use-case/interactor/validate_credentials.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { Nullable, Optional } from '@core/common/type/common_types';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/repository/user.repository';
import { map, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpAuthenticationService {
  private readonly logger: Logger = new Logger(HttpAuthenticationService.name);

  constructor(
    @Inject(UserDITokens.ValidateCredentialsInteractor)
    private readonly validate_credentials_interactor: ValidateCredentialsInteractor,
    private readonly jwt_service: JwtService,
    @Inject(UserDITokens.UserRepository)
    private readonly user_repository: UserRepository,
    private readonly config_service: ConfigService,
    private readonly http_service: HttpService,
    // @Inject(REQUEST)
    // private readonly request: Request
  ) { }

  public async validateUser(username: string, password: string): Promise<Nullable<HttpUserPayload>> {
    return await this.validate_credentials_interactor.execute({
      email: username,
      password,
    });
  }

  public login(user: HttpUserPayload): HttpLoggedInUser {
    const payload: HttpJwtPayload = { id: user.id };
    const access_token = this.jwt_service.sign(payload);
    if (user.is_two_factor_auth_enabled)
      return {
        access_token
      };
    return {
      id: user.id,
      customer_id: user.customer_id,
      email: user.email,
      roles: user.roles,
      access_token: access_token
    };
  }

  public async getUser(id: string): Promise<Optional<UserDTO>> {
    return await this.user_repository.findOne({ user_id: id });
  }

  public validateCaptcha(response: string): Observable<any> {
    const secretKey = this.config_service.get('CAPTCHA_SITE_KEY');
    // const remoteAddress = this.request.socket.remoteAddress;
    const url =
      'https://www.google.com/recaptcha/api/siteverify?secret=' +
      secretKey +
      '&response=' +
      response;
      // '&remoteip=' +
      // remoteAddress;
    return this.http_service
      .post(url)
      .pipe(
        map((response:any) => {
          if (!response.data.success){
            throw new BadGatewayException();
          }
          return response.data;
        }),
      );
  }
}
