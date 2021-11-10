import { UpdateUserAccountInteractor } from '@core/domain/user/use-case/update_user_account.interactor';
import UpdateUserAccountInputModel from '@core/domain/user/input-model/update_user_account.input_model';
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
import { UserAccountInvalidDataFormatException } from '@core/service/user/user_account.exception';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

@Injectable()
export class UpdateUserAccountService implements UpdateUserAccountInteractor {
  private readonly logger = new Logger(UpdateUserAccountService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly gateway: UpdateUserAccountGateway
  ) {
  }

  async execute(input: UpdateUserAccountInputModel): Promise<UpdateUserAccountOutputModel> {
    const { email, password, name, date_of_birth } = input;
    const is_a_valid_update = email && password && name && date_of_birth
      && isValidEmail(email) && isValidPassword(password)
      && isValidName(name) && isValidDateOfBirth(date_of_birth);
    if (!is_a_valid_update)
      throw new UserAccountInvalidDataFormatException();
    const updated_user: UserDTO = await this.gateway.update({
      user_id: input.id,
      email,
      password,
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
