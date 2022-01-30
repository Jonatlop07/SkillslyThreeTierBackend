interface SharedPermanentPostPayload {
  user_that_shares_id: string;
  post_id: string;
  post_owner_id: string;
}

export class SharedPermanentPostEvent {
  public readonly user_that_shares_id: string;
  public readonly post_id: string;
  public readonly post_owner_id: string;

  constructor(payload: SharedPermanentPostPayload) {
    this.user_that_shares_id = payload.user_that_shares_id;
    this.post_id = payload.post_id;
    this.post_owner_id = payload.post_owner_id;
  }
}
