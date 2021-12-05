import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';

export default interface ExistsUserFollowRequest {
  existsUserFollowRequest(params: FollowRequestDTO): Promise<boolean>;
  existsUserFollowRelationship(params: FollowRequestDTO): Promise<boolean>;
}