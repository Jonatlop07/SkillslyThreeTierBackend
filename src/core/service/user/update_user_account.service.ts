import { UpdateUserAccountInteractor } from '@core/domain/user/use-case/interactor/update_user_account.interactor';
import UpdateUserAccountInputModel from '@core/domain/user/use-case/input-model/update_user_account.input_model';
import UpdateUserAccountOutputModel from '@core/domain/user/use-case/output-model/update_user_account.output_model';
import { Inject, Logger } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import UpdateUserAccountGateway from '@core/domain/user/use-case/gateway/update_user_account.gateway';
import {
  isValidDateOfBirth,
  isValidEmail,
  isValidName,
  isValidPassword
} from '@core/common/util/validators/account_data.validators';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import {
  UserAccountAlreadyExistsException,
  UserAccountInvalidDataFormatException
} from '@core/domain/user/use-case/exception/user_account.exception';
import generateHashedPassword from '@core/common/util/validators/generate_hash_password';

export class UpdateUserAccountService implements UpdateUserAccountInteractor {
  private readonly logger = new Logger(UpdateUserAccountService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly gateway: UpdateUserAccountGateway
  ) {
  }

  public async execute(input: UpdateUserAccountInputModel): Promise<UpdateUserAccountOutputModel> {
    const { id, email, password, name, date_of_birth, is_two_factor_auth_enabled } = input;
    const password_does_not_change = !password ;
    const is_a_valid_update = email && name && date_of_birth
      && (password_does_not_change || password && isValidPassword(password))
      && isValidEmail(email) && isValidName(name)
      && isValidDateOfBirth(date_of_birth);
    if (!is_a_valid_update)
      throw new UserAccountInvalidDataFormatException();
    const existing_user_with_email = await this.gateway.findOne({ email });
    if (existing_user_with_email && existing_user_with_email.user_id !== id)
      throw new UserAccountAlreadyExistsException();
    const updated_user: UserDTO = await this.gateway.update({
      user_id: id,
      email,
      password: await this.getPasswordToUpdate(password, id),
      name,
      date_of_birth,
      is_two_factor_auth_enabled
    });
    return {
      email: updated_user.email,
      name: updated_user.name,
      date_of_birth: updated_user.date_of_birth,
      is_two_factor_auth_enabled: updated_user.is_two_factor_auth_enabled
    };
  }

  private async getPasswordToUpdate(password: string, user_id: string): Promise<string> {
    if (!password)
      return this.getUserPassword(user_id);
    return generateHashedPassword(password);
  }

  private async getUserPassword(user_id: string): Promise<string> {
    const user: UserDTO = await this.gateway.findOne({ user_id });
    return user.password;
  }
}
