import Exists from '@core/common/persistence/exists';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import CreateUserFollowRequest from '@core/domain/user/use-case/persistence/create_follow_request';
import ExistsUserFollowRequest from '@core/domain/user/use-case/persistence/exists_follow_request';

export default interface CreateUserFollowRequestGateway extends  CreateUserFollowRequest, ExistsUserFollowRequest, Exists<UserDTO> {}