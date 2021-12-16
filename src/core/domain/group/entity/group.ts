import { Entity } from '@core/common/entity/entity';
import { CreateGroupEntityPayload } from './type/create_group_entity_payload';

export class Group extends Entity<string> {
  private readonly _owner_id: string;
  private readonly _description: string;
  private readonly _name: string;
  private readonly _category: string;
  private readonly _picture: string;

  constructor(payload: CreateGroupEntityPayload) {
    super();
    const { id, name, description, category, picture, owner_id } = payload;
    this._id = id;
    this._owner_id = owner_id;
    this._name = name;
    this._description = description;
    this._category = category;
    this._picture = picture;
  }

  public hasEmptyInfo() {
    return !this._name || !this._category || !this._description;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get category (): string {
    return this._category;
  }

  get picture(): string {
    return this._picture;
  }

  get owner_id(): string {
    return this._owner_id;
  }
  
}