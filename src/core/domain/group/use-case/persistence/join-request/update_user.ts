import { JoinRequestDTO } from '../../persistence-dto/join_request.dto';
import GroupQueryModel from '../../query-model/group.query_model';

export default interface UpdateGroupUser{
  acceptUserJoinGroupRequest(params: GroupQueryModel): Promise<JoinRequestDTO>;
  rejectUserJoinGroupRequest(params: GroupQueryModel): Promise<JoinRequestDTO>;
  removeUserFromGroup(params: GroupQueryModel): Promise<JoinRequestDTO>;
}
