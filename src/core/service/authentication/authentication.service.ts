import { Inject, Injectable } from '@nestjs/common';
import { LogIntoAccountInteractor } from '@core/domain/user/use-case/log_into_account.interactor';
import LogIntoAccountInputModel from '@core/domain/user/input-model/log_into_account.input_model';
import { AuthenticationDITokens } from '@core/service/authentication/di/authentication_di_tokens';
import LogIntoAccountOutputModel from '@core/domain/user/use-case/output-model/log_into_account.output_model';


@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(AuthenticationDITokens.LogIntoAccountInteractor)
    private readonly logIntoAccountInteractor: LogIntoAccountInteractor
  ) {}

  async login(input: LogIntoAccountInputModel): Promise<any> {
    const output: LogIntoAccountOutputModel = await this.logIntoAccountInteractor.execute(input);

  }
}
