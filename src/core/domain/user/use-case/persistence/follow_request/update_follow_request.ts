import UpdateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/update_user_follow_request.input_model';
import UpdateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/update_user_follow_request.output_model';

export default interface UpdateUserFollowRequest {
  updateUserFollowRequest(params: UpdateUserFollowRequestInputModel): Promise<UpdateUserFollowRequestOutputModel>;
}