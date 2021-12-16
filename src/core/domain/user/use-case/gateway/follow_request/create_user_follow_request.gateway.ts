import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import CreateUserFollowRequest from '@core/domain/user/use-case/persistence/follow_request/create_follow_request';
import ExistsUserFollowRequest from '@core/domain/user/use-case/persistence/follow_request/exists_follow_request';
import Find from '@core/common/persistence/find';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';

export default interface CreateUserFollowRequestGateway
  extends  CreateUserFollowRequest, ExistsUserFollowRequest, Find<UserDTO, UserQueryModel> {}
