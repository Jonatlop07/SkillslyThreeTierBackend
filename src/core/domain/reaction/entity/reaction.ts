import { Entity } from '@core/common/entity/entity';
import { AddReactionEntityPayload } from './type/add_reaction_entity_payload';

export class PostReaction extends Entity<string> {
  private readonly _post_id: string;
  private readonly _reactor_id: string;
  private readonly _reaction_type: string;

  constructor(payload: AddReactionEntityPayload) {
    super();
    const { post_id, reactor_id, reaction_type } = payload;
    this._post_id = post_id;
    this._reactor_id = reactor_id;
    this._reaction_type = reaction_type;
  }

  get post_id(): string {
    return this._post_id;
  }

  get reactor_id(): string {
    return this._reactor_id;
  }

  get reaction_type(): string {
    return this.reaction_type;
  }
}
