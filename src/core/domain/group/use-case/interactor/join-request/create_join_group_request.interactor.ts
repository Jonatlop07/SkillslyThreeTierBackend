import { Interactor } from '@core/common/use-case/interactor';
import CreateJoinGroupRequestInputModel from '../../input-model/join-request/create_join_group_request.input_model';
import CreateJoinGroupRequestOutputModel from '../../output-model/join-request/create_join_group_request.output_model';
export interface CreateJoinGroupRequestInteractor
  extends Interactor<
  CreateJoinGroupRequestInputModel,
  CreateJoinGroupRequestOutputModel
  > { }
