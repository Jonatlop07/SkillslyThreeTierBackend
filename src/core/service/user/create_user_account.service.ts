import * as bcrypt from 'bcrypt';
import { Inject, Logger } from '@nestjs/common';
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
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidDateOfBirth
} from '@core/common/util/account_data.validators';

export class CreateUserAccountService implements CreateUserAccountInteractor {
  private readonly logger: Logger = new Logger(CreateUserAccountService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private gateway: CreateUserAccountGateway
  ) {}

  async execute(input?: CreateUserAccountInputModel): Promise<CreateUserAccountOutputModel> {
    const { email, password, name, date_of_birth } = input;
    if (!isValidEmail(email) || !isValidPassword(password)
        || !isValidName(name) || !isValidDateOfBirth(date_of_birth))
      throw new CreateUserAccountInvalidDataFormatException();
    const salt_rounds = 10;
    const hashed_password = await bcrypt.hash(password, salt_rounds);
    const user = new User({ email, password: hashed_password, name, date_of_birth });
    if (this.gateway.exists(user))
      throw new CreateUserAccountAlreadyExistsException();
    const createdUser: User = await this.gateway.create(user);
    return Promise.resolve({ email: createdUser.email });
  }
}
