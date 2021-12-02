import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/create_user_follow_request.input_model';

export default interface ExistsUserFollowRequest {
  existsUserFollowRequest(params: CreateUserFollowRequestInputModel): Promise<boolean>;
  existsUserFollowRelationship(params: CreateUserFollowRequestInputModel): Promise<boolean>;
}