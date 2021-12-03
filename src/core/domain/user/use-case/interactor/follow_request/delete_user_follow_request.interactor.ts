import { Interactor } from '@core/common/use-case/interactor';
import DeleteUserFollowRequestInputModel from '../../input-model/follow_request/delete_user_follow_request.input_model';
import DeleteUserFollowRequestOutputModel from '../../output-model/follow_request/delete_user_follow_request.output_model';

export interface DeleteUserFollowRequestInteractor extends Interactor<DeleteUserFollowRequestInputModel, DeleteUserFollowRequestOutputModel> {}