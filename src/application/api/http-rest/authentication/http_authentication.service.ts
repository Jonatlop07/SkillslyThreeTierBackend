import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  HttpJwtPayload,
  HttpLoggedInUser,
  HttpUserPayload
} from '@application/api/http-rest/authentication/types/http_authentication_types';
import { ValidateCredentialsInteractor } from '@core/domain/user/use-case/validate_credentials.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { Nullable, Optional } from '@core/common/type/common_types';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/user.repository';

@Injectable()
export class HttpAuthenticationService {
  private readonly logger: Logger = new Logger(HttpAuthenticationService.name);

  constructor(
    @Inject(UserDITokens.ValidateCredentialsInteractor)
    private readonly validate_credentials_interactor: ValidateCredentialsInteractor,
    private readonly jwt_service: JwtService,
    @Inject(UserDITokens.UserRepository)
    private readonly user_repository: UserRepository
  ) {}

  public async validateUser(username: string, password: string): Promise<Nullable<HttpUserPayload>> {
    return await this.validate_credentials_interactor.execute({
      email: username,
      password,
    });
  }

  public login(user: HttpUserPayload): HttpLoggedInUser {
    const payload: HttpJwtPayload = { id: user.id };
    return {
      id: user.id,
      access_token: this.jwt_service.sign(payload)
    };
  }

  public async getUser(id: string): Promise<Optional<UserDTO>> {
    return this.user_repository.findOneByParam('user_id', id);
  }
}
