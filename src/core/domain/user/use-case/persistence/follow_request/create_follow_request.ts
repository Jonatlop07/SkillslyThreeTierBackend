import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';

export default interface CreateUserFollowRequest {
  createUserFollowRequest(params: FollowRequestDTO): Promise<void>;
}
