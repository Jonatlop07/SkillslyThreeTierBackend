import Exists from '@core/common/persistence/exists';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import ExistsUserFollowRequest from '@core/domain/user/use-case/persistence/follow_request/exists_follow_request';
import UpdateUserFollowRequest from '../../persistence/follow_request/update_follow_request';

export default interface UpdateUserFollowRequestGateway extends  UpdateUserFollowRequest, ExistsUserFollowRequest, Exists<UserDTO> {}