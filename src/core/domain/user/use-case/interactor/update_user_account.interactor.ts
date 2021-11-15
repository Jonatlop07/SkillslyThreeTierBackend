import { Interactor } from '@core/common/use-case/interactor';
import UpdateUserAccountInputModel from '@core/domain/user/use-case/input-model/update_user_account.input_model';
import UpdateUserAccountOutputModel from '@core/domain/user/use-case/output-model/update_user_account.output_model';

export interface UpdateUserAccountInteractor extends Interactor<UpdateUserAccountInputModel, UpdateUserAccountOutputModel>{}
