export default interface UpdateUserFollowRequestInputModel {
  user_id: string;
  user_that_requests_id: string;
  accept: boolean;
}
