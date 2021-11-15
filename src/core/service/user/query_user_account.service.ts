import { QueryUserAccountInteractor } from '@core/domain/user/use-case/interactor/query_user_account.interactor';
import { Inject, Injectable } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import QueryUserAccountInputModel from '@core/domain/user/use-case/input-model/query_user_interactor.input_model';
import QueryUserAccountOutputModel from '@core/domain/user/use-case/output-model/query_user_interactor.output_model';
import QueryUserAccountGateway from '@core/domain/user/use-case/gateway/query_user_account.gateway';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';

@Injectable()
export class QueryUserAccountService implements QueryUserAccountInteractor {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly gateway: QueryUserAccountGateway
  ) {
  }

  async execute(input: QueryUserAccountInputModel): Promise<QueryUserAccountOutputModel> {
    const user: UserDTO = await this.gateway.queryById(input.id);
    if (!user)
      throw new UserAccountNotFoundException();
    return {
      email: user.email,
      name: user.name,
      date_of_birth: user.date_of_birth
    };
  }
}
