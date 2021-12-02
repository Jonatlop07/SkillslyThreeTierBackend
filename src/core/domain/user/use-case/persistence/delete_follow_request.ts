import DeleteUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/delete_user_follow_request.input_model';
import DeleteUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/delete_user_follow_request.output_model';

export default interface DeleteUserFollowRequest {
  deleteUserFollowRequest(params: DeleteUserFollowRequestInputModel): Promise<DeleteUserFollowRequestOutputModel>;
}