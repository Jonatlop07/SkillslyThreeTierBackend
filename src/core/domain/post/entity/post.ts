import { Entity } from '@core/common/entity/entity';
import { CreatePostEntityPayload } from '@core/domain/post/entity/type/create_post_entity_payload';

export class User extends Entity<string> {
  private readonly _description: string;
  private readonly _reference: string;
  private readonly _reference_type: string;

  constructor(payload: CreatePostEntityPayload) {
    super();
    const { description, reference, reference_type } = payload;
    this._description = description;
    this._reference = reference;
    this._reference_type = reference_type || '';
  }

  get description(): string {
    return this._description;
  }

  get reference(): string {
    return this._reference;
  }

  get reference_type(): string {
    return this._reference_type;
  }
}
