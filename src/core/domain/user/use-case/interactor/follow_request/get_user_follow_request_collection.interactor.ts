import { Interactor } from '@core/common/use-case/interactor';
import GetUserFollowRequestCollectionOutputModel from '@core/domain/user/use-case/output-model/follow_request/get_user_follow_request_collection.output_model';
import GetUserFollowRequestCollectionInputModel from '@core/domain/user/use-case/input-model/follow_request/get_user_follow_request_collection.input_model';

export interface GetUserFollowRequestCollectionInteractor extends Interactor<GetUserFollowRequestCollectionInputModel, GetUserFollowRequestCollectionOutputModel> {}