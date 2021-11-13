import { Entity } from '@core/common/entity/entity';
import { CreateProfileEntityPayload } from '@core/domain/profile/entity/type/create_profile_entity_payload';

export class Profile extends Entity<number> {
  private readonly _resume: string;
  private readonly _knowledge: Array<string>;
  private readonly _talents: Array<string>;
  private readonly _activities: Array<string>;
  private readonly _interests: Array<string>;
  private readonly _user_id: number;

  constructor(payload: CreateProfileEntityPayload) {
    super();
    this._resume = payload.resume;
    this._knowledge = payload.knowledge;
    this._talents = payload.talents;
    this._activities = payload.activities;
    this._interests = payload.interests;
    this._id = payload.id || 0;
  }

  get resume(): string {
    return this._resume;
  }

  get knowledge(): Array<string> {
    return this._knowledge;
  }

  get talents(): Array<string> {
    return this._talents;
  }

  get activities(): Array<string> {
    return this._activities;
  }

  get interests(): Array<string> {
    return this._interests;
  }

  get user_id(): number {
    return this._user_id;
  }
}
