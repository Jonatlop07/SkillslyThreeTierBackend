import UpdateUserFollowRequestInputModel from '../input-model/update_user_follow_request.input_model';
import UpdateUserFollowRequestOutputModel from '../output-model/update_user_follow_request.output_model';

export default interface UpdateUserFollowRequest {
  updateUserFollowRequest(params: UpdateUserFollowRequestInputModel): Promise<UpdateUserFollowRequestOutputModel>;
}