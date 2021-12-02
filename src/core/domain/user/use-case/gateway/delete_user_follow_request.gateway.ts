import Exists from "@core/common/persistence/exists";
import ExistsUserFollowRequest from '@core/domain/user/use-case/persistence/exists_follow_request';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import DeleteUserFollowRequest from "../persistence/delete_follow_request";



export default interface DeleteUserFollowRequestGateway extends  DeleteUserFollowRequest, ExistsUserFollowRequest, Exists<UserDTO> {}