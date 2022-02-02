interface FollowRequestAcceptedPayload {
  user_that_requests_id: string;
  user_that_accepts_id: string;
  user_name: string;
  user_email: string;
}

export class FollowRequestAcceptedEvent {
  public readonly user_that_requests_id: string;
  public readonly user_that_accepts_id: string;
  public readonly user_name: string;
  public readonly user_email: string;

  constructor(private readonly payload: FollowRequestAcceptedPayload) {
    this.user_that_requests_id = payload.user_that_requests_id;
    this.user_that_accepts_id = payload.user_that_accepts_id;
    this.user_name = payload.user_name;
    this.user_email = payload.user_email;
  }
}
