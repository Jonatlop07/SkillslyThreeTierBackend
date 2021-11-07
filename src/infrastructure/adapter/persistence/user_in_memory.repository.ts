import CreateUserAccountGateway from '@core/domain/user/use-case/gateway/create_user_account.gateway';
import { UserDTO } from '../../../core/domain/user/use-case/persistence-dto/user.dto';
import * as moment from 'moment';

export class UserInMemoryRepository implements CreateUserAccountGateway {
  private currently_available_user_id: string;

  constructor( private readonly users: Map<string, UserDTO>) {
    this.currently_available_user_id = '1';
  }

  async create(user: UserDTO): Promise<UserDTO> {
    const new_user: UserDTO = {
      id: this.currently_available_user_id,
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
}
