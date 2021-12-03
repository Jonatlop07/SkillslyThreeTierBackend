import GetUserFollowRequestCollectionInputModel from '@core/domain/user/use-case/input-model/follow_request/get_user_follow_request_collection.input_model';
import GetUserFollowRequestCollectionOutputModel from '@core/domain/user/use-case/output-model/follow_request/get_user_follow_request_collection.output_model';

export default interface GetUserFollowRequestCollection {
  getUserFollowRequestCollection(params: GetUserFollowRequestCollectionInputModel): Promise<GetUserFollowRequestCollectionOutputModel>;
}