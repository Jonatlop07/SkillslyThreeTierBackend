import Exists from '@core/common/persistence/exists';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import CreateUserFollowRequest from '../persistence/create_follow_request';

export default interface CreateUserFollowRequestGateway extends  CreateUserFollowRequest, Exists<UserDTO> {}