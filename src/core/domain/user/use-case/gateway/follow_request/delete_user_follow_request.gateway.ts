import ExistsUserFollowRequest from '@core/domain/user/use-case/persistence/follow_request/exists_follow_request';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import DeleteUserFollowRequest from '@core/domain/user/use-case/persistence/follow_request/delete_follow_request';
import Find from '@core/common/persistence/find';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';

export default interface DeleteUserFollowRequestGateway
  extends  DeleteUserFollowRequest, ExistsUserFollowRequest, Find<UserDTO, UserQueryModel> {}
