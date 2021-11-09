import { Optional } from '@core/common/type/common_types';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/user.repository';
import * as moment from 'moment';

export class UserInMemoryRepository implements UserRepository {
  private currently_available_user_id: string;

  constructor( private readonly users: Map<string, UserDTO>) {
    this.currently_available_user_id = '1';
  }

  async create(user: UserDTO): Promise<UserDTO> {
    const new_user: UserDTO = {
      user_id: this.currently_available_user_id,
      email: user.email,
      password: user.password,
      name: user.name,
      date_of_birth: user.date_of_birth,
      created_at: moment().format('DD/MM/YYYY')
    };
    this.users.set(this.currently_available_user_id, new_user);
    this.currently_available_user_id = `${Number(this.currently_available_user_id) + 1}`;
    return Promise.resolve(new_user);
  }

  async exists(user: UserDTO): Promise<boolean> {
    for (const _user of this.users.values())
      if (_user.email === user.email)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }

  findOneByParam(param: string, value: any): Promise<Optional<UserDTO>> {
    for (const _user of this.users.values())
      if (_user[param] === value)
        return Promise.resolve(_user);
    return Promise.resolve(undefined);
  }

  update(user: UserDTO): Promise<UserDTO> {
    const user_to_update: UserDTO = {
      user_id: user.user_id,
      password: user.password,
      email: user.email,
      name: user.name,
      date_of_birth: user.date_of_birth
    };
    this.users.set(user.user_id, user_to_update);
    return Promise.resolve(user_to_update);
  }

  queryById(id: string): Promise<Optional<UserDTO>> {
    for (const _user of this.users.values())
      if (_user.user_id === id)
        return Promise.resolve(_user);
    return Promise.resolve(undefined);
  }
}
