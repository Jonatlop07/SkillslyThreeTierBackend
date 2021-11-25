import { UpdateUserAccountInteractor } from '@core/domain/user/use-case/interactor/update_user_account.interactor';
import UpdateUserAccountInputModel from '@core/domain/user/use-case/input-model/update_user_account.input_model';
import UpdateUserAccountOutputModel from '@core/domain/user/use-case/output-model/update_user_account.output_model';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import UpdateUserAccountGateway from '@core/domain/user/use-case/gateway/update_user_account.gateway';
import {
  isValidDateOfBirth,
  isValidEmail,
  isValidName,
  isValidPassword
} from '@core/common/util/account_data.validators';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import { UserAccountInvalidDataFormatException } from '@core/domain/user/use-case/exception/user_account.exception';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UpdateUserAccountService implements UpdateUserAccountInteractor {
  private readonly logger = new Logger(UpdateUserAccountService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly gateway: UpdateUserAccountGateway
  ) {
  }

  async execute(input: UpdateUserAccountInputModel): Promise<UpdateUserAccountOutputModel> {
    const { id, email, password, name, date_of_birth } = input;
    const password_does_not_change = !password ;
    const is_a_valid_update = email && name && date_of_birth
      && (password_does_not_change || password && isValidPassword(password))
      && isValidEmail(email) && isValidName(name)
      && isValidDateOfBirth(date_of_birth);
    if (!is_a_valid_update)
      throw new UserAccountInvalidDataFormatException();
    let password_to_update: string;
    if (password_does_not_change) {
      const user: UserDTO = await this.gateway.findOne({ user_id: id });
      password_to_update = user.password;
    } else {
      const SALT_ROUNDS = 10;
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      password_to_update = bcrypt.hashSync(password, salt);
    }
    const updated_user: UserDTO = await this.gateway.update({
      user_id: id,
      email,
      password: password_to_update,
      name,
      date_of_birth
    });
    return {
      email: updated_user.email,
      name: updated_user.name,
      date_of_birth: updated_user.date_of_birth
    };
  }
}
