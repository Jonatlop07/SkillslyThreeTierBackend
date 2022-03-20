import GetUserFollowRequestCollection from '@core/domain/user/use-case/persistence/follow_request/get_user_follow_request_collection';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import Exists from '@core/common/persistence/exists';

export default interface GetUserFollowRequestCollectionGateway
  extends GetUserFollowRequestCollection, Exists<UserQueryModel> {}
