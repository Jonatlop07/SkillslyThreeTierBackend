import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import ExistsUserFollowRequest from '@core/domain/user/use-case/persistence/follow_request/exists_follow_request';
import UpdateUserFollowRequest from '../../persistence/follow_request/update_follow_request';
import Find from '@core/common/persistence/find';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';

export default interface UpdateUserFollowRequestGateway
  extends  UpdateUserFollowRequest, ExistsUserFollowRequest, Find<UserDTO, UserQueryModel> {}
