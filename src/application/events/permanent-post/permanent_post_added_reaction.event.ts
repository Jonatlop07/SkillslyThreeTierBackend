interface PermanentPostAddedReactionPayload {
  post_owner_id: string;
  post_id: string;
  reactor_id: string;
  reaction_type: string;
}

export class PermanentPostAddedReactionEvent {
  public readonly post_owner_id: string;
  public readonly post_id: string;
  public readonly reactor_id: string;
  public readonly reaction_type: string;

  constructor(payload: PermanentPostAddedReactionPayload) {
    this.post_owner_id = payload.post_owner_id;
    this.post_id = payload.post_id;
    this.reactor_id = payload.reactor_id;
    this.reaction_type = payload.reaction_type;
  }
}
