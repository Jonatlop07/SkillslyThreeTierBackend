import { Injectable } from '@nestjs/common';
import { LogIntoAccountInteractor } from '@core/domain/user/use-case/log_into_account.interactor';
import LogIntoAccountInputModel from '@core/domain/user/input-model/log_into_account.input_model';
import LogIntoAccountOutputModel from '@core/domain/user/use-case/output-model/log_into_account.output_model';

@Injectable()
export class LogIntoAccountService implements LogIntoAccountInteractor {
  execute(input: LogIntoAccountInputModel): Promise<LogIntoAccountOutputModel> {
    return Promise.resolve(undefined);
  }
}
