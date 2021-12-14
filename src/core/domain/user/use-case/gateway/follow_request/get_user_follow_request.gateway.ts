import Exists from '@core/common/persistence/exists';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import GetUserFollowRequestCollection from '@core/domain/user/use-case/persistence/follow_request/get_user_follow_request_collection';

export default interface GetUserFollowRequestCollectionGateway extends  GetUserFollowRequestCollection, Exists<UserDTO> {}