import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/create_user_follow_request.input_model';
import CreateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/create_user_follow_request.output_model';

export default interface CreateUserFollowRequest {
  createUserFollowRequest(params: CreateUserFollowRequestInputModel): Promise<CreateUserFollowRequestOutputModel>;
}