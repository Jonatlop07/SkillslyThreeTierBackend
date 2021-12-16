import { Interactor } from '@core/common/use-case/interactor';
import UpdateGroupUserInputModel from '../../input-model/join-request/update_group_user.input_model';
import UpdateGroupUserOutputModel from '../../output-model/join-request/update_group_user.output_model';
export interface UpdateGroupUserInteractor
  extends Interactor<
  UpdateGroupUserInputModel,
  UpdateGroupUserOutputModel
  > { }
