interface FollowRequestDeletedPayload {
  user_destiny_id: string;
  user_id: string;
}

export class FollowRequestDeletedEvent{
  user_destiny_id: string;
  public readonly user_id: string;

  constructor(private readonly payload: FollowRequestDeletedPayload) {
    this.user_id = payload.user_id;
  }
}
