import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';

export default interface UpdateUserFollowRequest {
  acceptUserFollowRequest(params: FollowRequestDTO): Promise<void>;
  rejectUserFollowRequest(params: FollowRequestDTO): Promise<void>;
}
