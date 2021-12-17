export default interface DeleteUserFollowRequestInputModel {
  user_id: string;
  user_to_follow_id: string;
  is_request: boolean;
}
