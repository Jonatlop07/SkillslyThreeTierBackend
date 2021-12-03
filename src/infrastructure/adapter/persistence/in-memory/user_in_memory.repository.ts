import { Optional } from '@core/common/type/common_types';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/repository/user.repository';
import * as moment from 'moment';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/create_user_follow_request.input_model';
import CreateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/create_user_follow_request.output_model';
import UpdateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/update_user_follow_request.input_model';
import UpdateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/update_user_follow_request.output_model';
import DeleteUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/delete_user_follow_request.input_model';
import DeleteUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/delete_user_follow_request.output_model';
import GetUserFollowRequestCollectionInputModel from '@core/domain/user/use-case/input-model/follow_request/get_user_follow_request_collection.input_model';
import GetUserFollowRequestCollectionOutputModel from '@core/domain/user/use-case/output-model/follow_request/get_user_follow_request_collection.output_model';

export class UserInMemoryRepository implements UserRepository {
  private currently_available_user_id: string;
  private currently_available_user_follow_request: string; 
  private currently_available_user_follow_relationship: string;

  constructor(public readonly users: Map<string, UserDTO>) {
    this.currently_available_user_id = '1';
  }
  delete(params: string): Promise<UserDTO> {
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

  public existsUserFollowRequest(params: CreateUserFollowRequestInputModel): Promise<boolean> {
    if (this.currently_available_user_follow_request == params.user_id.concat(params.user_id)){
      return Promise.resolve(true); 
    }
    return Promise.resolve(false); 
  }

  public async createUserFollowRequest(params: CreateUserFollowRequestInputModel): Promise<CreateUserFollowRequestOutputModel> {
    this.currently_available_user_follow_request = params.user_id.concat(params.user_id);
    return Promise.resolve({});
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

  public existsUserFollowRelationship(params: CreateUserFollowRequestInputModel) {
    if (this.currently_available_user_follow_relationship == params.user_id.concat(params.user_id)){
      return Promise.resolve(true); 
    }
    return Promise.resolve(false); 
  }

  public findOne(params: UserQueryModel): Promise<UserDTO> {
    for (const user of this.users.values()){
      if (Object.keys(params).every((key: string) => params[key] === user[key])){
        return Promise.resolve(user);
      }
    }
    return Promise.resolve(undefined);
  }

  public findAll(params: any): Promise<Array<UserDTO>>{
    const response_users: Array<UserDTO> = [];
    for (const _user of this.users.values())
      if (_user.email === params.email || _user.name === params.name)
        response_users.push(_user);
    return Promise.resolve(response_users);
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

  public updateUserFollowRequest(params: UpdateUserFollowRequestInputModel): Promise<UpdateUserFollowRequestOutputModel>{
    if (params.action == 'accept') {
      this.currently_available_user_follow_relationship = params.user_id.concat(params.user_id);
    } else {
      this.currently_available_user_follow_request = '';
    }
    return Promise.resolve({}); 
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

  public deleteUserFollowRequest(params: DeleteUserFollowRequestInputModel): Promise<DeleteUserFollowRequestOutputModel>{
    if (params.action == 'relationship') {
      this.currently_available_user_follow_relationship = '';
    } else {
      this.currently_available_user_follow_request = '';
    }
    return Promise.resolve({}); 
  }

  public async getUserFollowRequestCollection(params: GetUserFollowRequestCollectionInputModel): Promise<GetUserFollowRequestCollectionOutputModel> {
    params.user_id;
    return Promise.resolve({pendingUsers: [], followingUsers: []}); 
  }
}
