import ExistsUserFollowRequest from '@core/domain/user/use-case/persistence/follow_request/exists_follow_request';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import DeleteUserFollowRequest from '@core/domain/user/use-case/persistence/follow_request/delete_follow_request';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import FindOne from '@core/common/persistence/find/find_one';

export default interface DeleteUserFollowRequestGateway
  extends  DeleteUserFollowRequest, ExistsUserFollowRequest, FindOne<UserQueryModel, UserDTO> {}
