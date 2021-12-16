import { Entity } from '@core/common/entity/entity';
import { CreateProjectEntityPayload } from '@core/domain/project/entity/type/create_project_entity_payload';

export class Project extends Entity<string> {
  private readonly _user_id: string;
  private readonly _user_name: string;
  private readonly _title: string;
  private readonly _members: string[];
  private readonly _description: string;
  private readonly _reference: string;
  private readonly _reference_type: string;
  private readonly _annexes: string[];

  constructor(payload: CreateProjectEntityPayload) {
    super();
    const {
      id,
      user_id,
      title,
      members,
      description,
      reference,
      reference_type,
      annexes,
    } = payload;
    this._id = id;
    this._user_id = user_id;
    this._title = title;
    this._members = members;
    this._description = description;
    this._reference = reference;
    this._reference_type = reference_type;
    this._annexes = annexes;
  }

  public hasNonEmptyContent() {
    return this.description && this.description.length > 0;
  }

  get user_id() {
    return this._user_id;
  }

  get title() {
    return this._title;
  }

  get members() {
    return this._members;
  }

  get description() {
    return this._description;
  }

  get reference() {
    return this._reference;
  }

  get reference_type() {
    return this._reference_type;
  }

  get annexes() {
    return this._annexes;
  }
}
