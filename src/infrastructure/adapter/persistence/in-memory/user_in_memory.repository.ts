import { Optional } from '@core/common/type/common_types';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/repository/user.repository';
import * as moment from 'moment';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';
import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';

export class UserInMemoryRepository implements UserRepository {
  private currently_available_user_id: string;
  private currently_available_user_follow_request: string;
  private currently_available_user_follow_relationship: string;

  constructor(public readonly users: Map<string, UserDTO>) {
    this.currently_available_user_id = '1';
  }

  delete(params: string): Promise<UserDTO> {
    params;
    throw new Error('Method not implemented.');
  }

  public create(user: UserDTO): Promise<UserDTO> {
    const new_user: UserDTO = {
      user_id: this.currently_available_user_id,
      email: user.email,
      password: user.password,
      name: user.name,
      date_of_birth: user.date_of_birth,
      created_at: moment().local().format('YYYY/MM/DD HH:mm:ss'),
    };
    this.users.set(this.currently_available_user_id, new_user);
    this.currently_available_user_id = `${Number(this.currently_available_user_id) + 1}`;
    return Promise.resolve(new_user);
  }

  public existsUserFollowRequest(params: FollowRequestDTO): Promise<boolean> {
    if (this.currently_available_user_follow_request == params.user_id.concat(params.user_to_follow_id)) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  public async createUserFollowRequest(params: FollowRequestDTO): Promise<void> {
    this.currently_available_user_follow_request = params.user_id.concat(params.user_to_follow_id);
    return Promise.resolve();
  }

  public exists(user: UserDTO): Promise<boolean> {
    for (const _user of this.users.values())
      if (_user.email === user.email)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }

  public existsById(id: string): Promise<boolean> {
    for (const _user of this.users.values())
      if (_user.user_id === id)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }

  public existsUserFollowRelationship(params: FollowRequestDTO): Promise<boolean> {
    if (this.currently_available_user_follow_relationship == params.user_id.concat(params.user_to_follow_id)) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  public findOne(params: UserQueryModel): Promise<UserDTO> {
    for (const user of this.users.values()) {
      if (Object.keys(params).every((key: string) => params[key] === user[key])) {
        return Promise.resolve(user);
      }
    }
    return Promise.resolve(undefined);
  }

  public findAll(params: any): Promise<Array<UserDTO>> {
    const response_users: Array<UserDTO> = [];
    for (const _user of this.users.values())
      if (_user.email === params.email || _user.name === params.name)
        response_users.push(_user);
    return Promise.resolve(response_users);
  }

  public findAllWithRelation() {
    return null;
  }


  public update(user: UserDTO): Promise<UserDTO> {
    const user_to_update: UserDTO = {
      user_id: user.user_id,
      password: user.password,
      email: user.email,
      name: user.name,
      date_of_birth: user.date_of_birth,
      updated_at: moment().local().format('YYYY/MM/DD HH:mm:ss'),
    };
    this.users.set(user.user_id, user_to_update);
    return Promise.resolve(user_to_update);
  }

  public acceptUserFollowRequest(params: FollowRequestDTO): Promise<void> {
    this.currently_available_user_follow_relationship = params.user_id.concat(params.user_to_follow_id);
    return Promise.resolve();
  }

  public rejectUserFollowRequest(params: FollowRequestDTO): Promise<void> {
    params;
    this.currently_available_user_follow_request = '';
    return Promise.resolve();
  }

  public queryById(id: string): Promise<Optional<UserDTO>> {
    for (const _user of this.users.values())
      if (_user.user_id === id)
        return Promise.resolve(_user);
    return Promise.resolve(undefined);
  }

  public deleteById(id: string): Promise<UserDTO> {
    const user_to_delete = this.users.get(id);
    this.users.delete(id);
    return Promise.resolve(user_to_delete);
  }

  public deleteUserFollowRequest(params: FollowRequestDTO): Promise<void> {
    params;
    this.currently_available_user_follow_request = '';
    return Promise.resolve();
  }

  public deleteUserFollowRelationship(params: FollowRequestDTO): Promise<void> {
    params;
    this.currently_available_user_follow_relationship = '';
    return Promise.resolve();
  }

  public async getUserFollowRequestCollection(id: string): Promise<Array<Array<SearchedUserDTO>>> {
    id;
    return Promise.resolve([[], [], []]);
  }
}
