import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import ExistsUserFollowRequest from '@core/domain/user/use-case/persistence/follow_request/exists_follow_request';
import UpdateUserFollowRequest from '../../persistence/follow_request/update_follow_request';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import FindOne from '@core/common/persistence/find_one';

export default interface UpdateUserFollowRequestGateway
  extends  UpdateUserFollowRequest, ExistsUserFollowRequest, FindOne<UserQueryModel, UserDTO> {}
