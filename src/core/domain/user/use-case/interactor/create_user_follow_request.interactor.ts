import { Interactor } from '@core/common/use-case/interactor';
import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/create_user_follow_request.input_model';
import CreateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/create_user_follow_request.output_model';

export interface CreateUserFollowRequestInteractor extends Interactor<CreateUserFollowRequestInputModel, CreateUserFollowRequestOutputModel> {}