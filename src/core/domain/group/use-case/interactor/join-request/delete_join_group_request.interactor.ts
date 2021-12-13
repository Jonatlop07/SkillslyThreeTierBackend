import { Interactor } from '@core/common/use-case/interactor';
import DeleteJoinGroupRequestInputModel from '../../input-model/join-request/delete_join_group_request.input_model';
import DeleteJoinGroupRequestOutputModel from '../../output-model/join-request/delete_join_group_request.output_model';
export interface DeleteJoinGroupRequestInteractor
  extends Interactor<
  DeleteJoinGroupRequestInputModel,
  DeleteJoinGroupRequestOutputModel
  > { }
