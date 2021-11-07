import { Entity } from '@core/common/entity/entity';
import { CreateUserEntityPayload } from '@core/domain/user/entity/type/create_user_entity_payload';

export class User extends Entity<string> {
  private readonly _email: string;
  private readonly _password: string;
  private readonly _name: string;
  private readonly _date_of_birth: string;

  constructor(payload: CreateUserEntityPayload) {
    super();
    const { email, password, name, date_of_birth } = payload;
    this._email = email;
    this._password = password;
    this._name = name;
    this._date_of_birth = date_of_birth;
    this._id = payload.id || '';
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get name (): string {
    return this._name;
  }

  get date_of_birth (): string {
    return this._date_of_birth;
  }
}
