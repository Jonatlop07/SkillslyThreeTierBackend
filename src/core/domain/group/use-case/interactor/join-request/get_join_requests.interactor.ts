import { Interactor } from '@core/common/use-case/interactor';
import GetJoinRequestsInputModel from '../../input-model/join-request/get_join_requests.input_model';
import GetJoinRequestsOutputModel from '../../output-model/join-request/get_join_requests.output_model';
export interface GetJoinRequestsInteractor
  extends Interactor<
  GetJoinRequestsInputModel,
  GetJoinRequestsOutputModel
  > { }
