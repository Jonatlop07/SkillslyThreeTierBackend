interface FollowRequestDeletedPayload {
  user_to_notify_id: string;
  user_id: string;
}

export class FollowRequestDeletedEvent{
  public readonly user_to_notify_id: string;
  public readonly user_id: string;

  constructor(private readonly payload: FollowRequestDeletedPayload) {
    this.user_to_notify_id = payload.user_to_notify_id;
    this.user_id = payload.user_id;
  }
}
