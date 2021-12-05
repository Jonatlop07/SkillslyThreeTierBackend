import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';

export default interface DeleteUserFollowRequest {
  deleteUserFollowRequest(params: FollowRequestDTO): Promise<Object>;
  deleteUserFollowRelationship(params: FollowRequestDTO): Promise<Object>;
}