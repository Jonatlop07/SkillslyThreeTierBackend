import { Interactor } from '@core/common/use-case/interactor';
import DeleteUserAccountInputModel from '@core/domain/user/use-case/input-model/delete_user_account.input_model';
import DeleteUserAccountOutputModel from '@core/domain/user/use-case/output-model/delete_user_account.output_model';

export interface DeleteUserAccountInteractor extends Interactor<DeleteUserAccountInputModel, DeleteUserAccountOutputModel> {}
