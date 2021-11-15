import { Interactor } from '@core/common/use-case/interactor';
import ValidateCredentialsInputModel from '@core/domain/user/use-case/input-model/validate_credentials.input_model';
import ValidateCredentialsOutputModel from '@core/domain/user/use-case/output-model/validate_credentials.output_model';

export interface ValidateCredentialsInteractor extends Interactor<ValidateCredentialsInputModel, ValidateCredentialsOutputModel> {}
