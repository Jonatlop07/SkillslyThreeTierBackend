interface FollowRequestSentToUserPayload {
  user_destiny_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
}

export class FollowRequestSentToUserEvent{
  user_destiny_id: string;
  public readonly user_id: string;
  public readonly user_name: string;
  public readonly user_email: string;

  constructor(private readonly payload: FollowRequestSentToUserPayload) {
    this.user_id = payload.user_id;
    this.user_name = payload.user_name;
    this.user_email = payload.user_email;
  }
}
