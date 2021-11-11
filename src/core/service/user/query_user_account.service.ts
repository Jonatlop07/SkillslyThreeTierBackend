import { QueryUserAccountInteractor } from '@core/domain/user/use-case/query_user_account.interactor';
import { Inject, Injectable } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import QueryUserAccountInputModel from '@core/domain/user/input-model/query_user_interactor.input_model';
import QueryUserAccountOutputModel from '@core/domain/user/use-case/output-model/query_user_interactor.output_model';
import QueryUserAccountGateway from '@core/domain/user/use-case/gateway/query_user_account.gateway';

@Injectable()
export class QueryUserAccountService implements QueryUserAccountInteractor {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly gateway: QueryUserAccountGateway
  ) {}

  async execute(input: QueryUserAccountInputModel): Promise<QueryUserAccountOutputModel> {
    const { email, name, date_of_birth } = await this.gateway.queryById(input.id);
    return {
      email,
      name,
      date_of_birth
    };
  }
}
