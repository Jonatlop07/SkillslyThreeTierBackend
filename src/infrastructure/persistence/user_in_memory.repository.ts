import CreateUserAccountGateway from '@core/domain/user/use-case/gateway/create_user_account.gateway';
import { User } from '@core/domain/user/entity/user';

export class UserInMemoryRepository implements CreateUserAccountGateway {
  private currently_available_user_id: number;

  constructor( private readonly users: Map<number, User>) {
    this.currently_available_user_id = 1;
  }

  create(user: User): User {
    const new_user = new User({
      id: this.currently_available_user_id,
      email: user.email,
      password: user.password,
      name: user.name,
      date_of_birth: user.date_of_birth
    });
    this.users.set(this.currently_available_user_id, new_user);
    this.currently_available_user_id++;
    return new_user;
  }

  exists(user: User): boolean {
    for (const _user of this.users.values())
      if (_user.email === user.email)
        return true;
    return false;
  }
}
