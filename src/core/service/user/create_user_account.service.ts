import { Inject, Logger } from '@nestjs/common';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateUserAccountGateway from '@core/domain/user/use-case/gateway/create_user_account.gateway';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreateUserAccountOutputModel from '@core/domain/user/use-case/output-model/create_user_account.output_model';
import {
  UserAccountAlreadyExistsException,
  UserAccountInvalidDataFormatException
} from '@core/domain/user/use-case/exception/user_account.exception';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidDateOfBirth,
} from '@core/common/util/validators/account_data.validators';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import generateHashedPassword from '@core/common/util/validators/generate_hash_password';
import { Role } from '@core/domain/user/entity/type/role.enum';

export class CreateUserAccountService implements CreateUserAccountInteractor {
  private readonly logger: Logger = new Logger(CreateUserAccountService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private gateway: CreateUserAccountGateway,
  ) {
  }

  public async execute(input: CreateUserAccountInputModel): Promise<CreateUserAccountOutputModel> {
    const { email, password, name, date_of_birth, is_investor, is_requester } = input;
    const is_a_valid_input = email && password && name && date_of_birth
      && isValidEmail(email) && isValidPassword(password)
      && isValidName(name) && isValidDateOfBirth(date_of_birth);
    if (!is_a_valid_input)
      throw new UserAccountInvalidDataFormatException();
    const roles = [];
    if (is_investor) roles.push(Role.Investor);
    if (is_requester) roles.push(Role.Requester);
    const user_to_create: UserDTO = {
      email,
      password: generateHashedPassword(password),
      name,
      date_of_birth,
      roles
    };
    if (await this.gateway.exists(user_to_create))
      throw new UserAccountAlreadyExistsException();
    const created_user: UserDTO = await this.gateway.create(user_to_create);
    return { id: created_user.user_id, email: created_user.email };
  }
}
