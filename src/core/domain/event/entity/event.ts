import { Entity } from '@core/common/entity/entity';
import { CreateEventEntityPayload } from './type/create_event_entity_payload';

export class Event extends Entity<string> {
  private readonly _name: string;
  private readonly _description: string;
  private readonly _lat: number;
  private readonly _long: number;
  private readonly _date: Date;
  private readonly _user_id: string;

  constructor(payload: CreateEventEntityPayload) {
    super();
    const { id, name, description, lat, long, date, user_id } = payload;
    this._id = id;
    this._name = name;
    this._description = description;
    this._lat = lat;
    this._long = long;
    this._date = date;
    this._user_id = user_id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get lat() {
    return this._lat;
  }

  get long() {
    return this._long;
  }

  get date() {
    return this._date;
  }

  get user_id() {
    return this._user_id;
  }

}
