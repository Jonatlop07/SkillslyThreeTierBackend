import { Inject, Injectable, Logger } from '@nestjs/common';
import { DeleteUserAccountInteractor } from '@core/domain/user/use-case/interactor/delete_user_account.interactor';
import DeleteUserAccountInputModel from '@core/domain/user/use-case/input-model/delete_user_account.input_model';
import DeleteUserAccountOutputModel from '@core/domain/user/use-case/output-model/delete_user_account.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import DeleteUserAccountGateway from '@core/domain/user/use-case/gateway/delete_user_account.gateway';

@Injectable()
export class DeleteUserAccountService implements DeleteUserAccountInteractor {
  private readonly logger: Logger = new Logger(DeleteUserAccountService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly gateway: DeleteUserAccountGateway
  ) {}

  async execute({ id }: DeleteUserAccountInputModel): Promise<DeleteUserAccountOutputModel> {
    this.logger.log(await this.gateway.deleteById(id));
    return {};
  }
}
