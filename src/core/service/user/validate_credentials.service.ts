import * as bcrypt from 'bcryptjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ValidateCredentialsInteractor } from '@core/domain/user/use-case/validate_credentials.interactor';
import ValidateCredentialsInputModel from '@core/domain/user/input-model/validate_credentials.input_model';
import ValidateCredentialsOutputModel from '@core/domain/user/use-case/output-model/validate_credentials.output_model';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import ValidateCredentialsGateway from '@core/domain/user/use-case/gateway/validate_credentials.gateway';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import {
  ValidateCredentialsInvalidCredentialsException,
  ValidateCredentialsNonExistentAccountException
} from '@core/service/user/validate_credentials.exception';

@Injectable()
export class ValidateCredentialsService implements ValidateCredentialsInteractor {
  private readonly logger: Logger = new Logger(ValidateCredentialsService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly gateway: ValidateCredentialsGateway
  ) {}

  async execute(input: ValidateCredentialsInputModel): Promise<ValidateCredentialsOutputModel> {
    const resulting_user: UserDTO = await this.gateway.findOneByParam('email', input.email);
    if (!resulting_user)
      throw new ValidateCredentialsNonExistentAccountException();
    if (!bcrypt.compareSync(input.password, resulting_user.password))
      throw new ValidateCredentialsInvalidCredentialsException();
    return {
      id: resulting_user.user_id,
      email: resulting_user.email
    };
  }
}
