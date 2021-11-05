import { Inject } from '@nestjs/common';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import CreateUserAccountGateway from '@core/domain/user/use-case/gateway/create_user_account.gateway';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import CreateUserAccountOutputModel from '@core/domain/user/use-case/output-model/create_user_account.output_model';
import {
  CreateUserAccountAlreadyExistsException,
  CreateUserAccountInvalidDataFormatException
} from '@core/service/user/create_user_account.exception';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { User } from '@core/domain/user/entity/user';

export class CreateUserAccountService implements CreateUserAccountInteractor {
  private static readonly MAX_NAME_LENGTH = 30;

  constructor(
    @Inject(UserDITokens.UserRepository)
    private gateway: CreateUserAccountGateway
  ) {}

  async execute(input?: CreateUserAccountInputModel): Promise<CreateUserAccountOutputModel> {
    const { email, password, name, date_of_birth } = input;
    if (!CreateUserAccountService.isValidEmail(email)
        || !CreateUserAccountService.isValidPassword(password)
        || !CreateUserAccountService.isValidName(name)
        || !CreateUserAccountService.isValidDateOfBirth(date_of_birth))
      throw new CreateUserAccountInvalidDataFormatException();
    const user = new User({ email, password, name, date_of_birth });
    if (this.gateway.exists(user))
      throw new CreateUserAccountAlreadyExistsException();
    const createdUser: User = await this.gateway.create(user);
    return Promise.resolve({ email: createdUser.email });
  }

  private static isValidEmail(email) {
    return /^[_A-Za-z0-9-\\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
      .test(email);
  }

  private static isValidPassword(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
      .test(password);
  }

  private static isValidName(name) {
    return name !== '' && name.length <= CreateUserAccountService.MAX_NAME_LENGTH;
  }

  private static isValidDateOfBirth(date_of_birth) {
    return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
      .test(date_of_birth);
  }
}
