import { Interactor } from '@core/common/use-case/interactor';
import LogIntoAccountInputModel from '@core/domain/user/input-model/log_into_account.input_model';
import LogIntoAccountOutputModel from '@core/domain/user/use-case/output-model/log_into_account.output_model';

export interface LogIntoAccountInteractor extends Interactor<LogIntoAccountInputModel, LogIntoAccountOutputModel> {}
