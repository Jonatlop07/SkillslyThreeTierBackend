interface FollowRequestSentToUserPayload {
  user_to_follow_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
}

export class FollowRequestSentToUserEvent{
  public readonly user_to_follow_id: string;
  public readonly user_id: string;
  public readonly user_name: string;
  public readonly user_email: string;

  constructor(private readonly payload: FollowRequestSentToUserPayload) {
    this.user_to_follow_id = payload.user_to_follow_id;
    this.user_id = payload.user_id;
    this.user_name = payload.user_name;
    this.user_email = payload.user_email;
  }
}
