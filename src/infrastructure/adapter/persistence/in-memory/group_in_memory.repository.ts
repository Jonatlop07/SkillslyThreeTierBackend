import { BasicGroupDTO } from '@core/domain/group/use-case/persistence-dto/basic_group_data.dto';
import { GroupDTO } from '@core/domain/group/use-case/persistence-dto/group.dto';
import { GroupUserDTO } from '@core/domain/group/use-case/persistence-dto/group_users.dto';
import { JoinRequestDTO } from '@core/domain/group/use-case/persistence-dto/join_request.dto';
import GroupQueryModel from '@core/domain/group/use-case/query-model/group.query_model';
import GroupRepository from '@core/domain/group/use-case/repository/group.repository';

export class GroupInMemoryRepository implements GroupRepository {
  private current_group_id: string;
  private current_join_request: string;
  private current_join_user_id: string;
  private current_group_user_relationship = '';
  private current_join_request_user_id: string;

  constructor(private readonly groups: Map<string, GroupDTO>) {
    this.current_group_id = '1';
  }

  public queryUsers(group_id: string): Promise<GroupUserDTO[]> {
    const group = this.groups.get(group_id);
    return Promise.resolve([ { user_id: this.current_join_user_id }, { user_id: group.owner_id }]);
  }

  public getJoinRequests(group_id: string): Promise<JoinRequestDTO[]> {
    return Promise.resolve([ { group_id: group_id, user_id: this.current_join_request_user_id }]);
  }

  public acceptUserJoinGroupRequest(params: GroupQueryModel): Promise<JoinRequestDTO> {
    this.current_group_user_relationship = params.user_id.concat(
      params.group_id,
    );
    this.current_join_user_id = params.user_id;
    return Promise.resolve({
      user_id: params.user_id,
      group_id: params.group_id,
    });
  }

  public rejectUserJoinGroupRequest(params: GroupQueryModel): Promise<JoinRequestDTO> {
    this.current_join_request = '';
    return Promise.resolve({
      user_id: params.user_id,
      group_id: params.group_id,
    });
  }

  public removeUserFromGroup(params: GroupQueryModel): Promise<JoinRequestDTO> {
    this.current_group_user_relationship = '';
    return Promise.resolve({
      user_id: params.user_id,
      group_id: params.group_id,
    });
  }

  public deleteJoinRequest(params: JoinRequestDTO): Promise<JoinRequestDTO> {
    this.current_join_request = '';
    return Promise.resolve({
      user_id: params.user_id,
      group_id: params.group_id,
    });
  }

  public existsJoinRequest(param: GroupQueryModel): Promise<boolean> {
    if (this.current_join_request === param.user_id.concat(param.group_id)) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
  public existsGroupUserRelationship(param: GroupQueryModel): Promise<boolean> {
    if (
      this.current_group_user_relationship ===
      param.user_id.concat(param.group_id)
    ) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  public createJoinRequest(params: JoinRequestDTO): Promise<JoinRequestDTO> {
    this.current_join_request = params.user_id.concat(params.group_id);
    this.current_join_request_user_id = params.user_id;
    return Promise.resolve({
      user_id: params.user_id,
      group_id: params.group_id,
    });
  }

  public update(group: GroupDTO): Promise<GroupDTO> {
    const group_to_update: GroupDTO = {
      id: group.id,
      owner_id: group.owner_id,
      description: group.description,
      name: group.name,
      category: group.category,
      picture: group.picture,
    };
    this.groups.set(group.id, group_to_update);
    return Promise.resolve(group_to_update);
  }

  public userIsOwner(params: GroupQueryModel): Promise<boolean> {
    const { group_id, user_id } = params;
    if (this.groups.get(group_id).owner_id === user_id) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  public create(group: GroupDTO): Promise<GroupDTO> {
    const new_group: GroupDTO = {
      id: this.current_group_id,
      owner_id: group.owner_id,
      name: group.name,
      description: group.description,
      category: group.category,
      picture: group.picture,
    };
    this.groups.set(this.current_group_id, new_group);
    this.current_group_id = `${Number(this.current_group_id) + 1}`;
    return Promise.resolve(new_group);
  }

  public deleteById(group_id: string): Promise<GroupDTO> {
    for (const group of this.groups.values()) {
      if (group.id === group_id) {
        this.groups.delete(group_id);
        return Promise.resolve(group);
      }
    }
    return Promise.resolve(undefined);
  }

  public leaveGroup(param: GroupQueryModel): Promise<BasicGroupDTO> {
    this.current_group_user_relationship = '';
    return Promise.resolve({
      user_id: param.user_id,
      group_id: param.group_id,
    });
  }

  public groupHasMoreOwners(group_id: string): Promise<boolean> {
    group_id;
    return Promise.resolve(false);
  }

  public userIsMember(param: GroupQueryModel): Promise<boolean> {
    return Promise.resolve(
      this.current_group_user_relationship ===
        param.group_id.concat(param.user_id),
    );
  }

  public findOne(params: GroupQueryModel): Promise<GroupDTO> {
    let queried_group: GroupDTO;
    for (const group of this.groups.values()){
      if (group.id === params.group_id){
        queried_group = group;
      }
    }
    return Promise.resolve(queried_group);
  }

  public findUserGroups(user_id: string): Promise<BasicGroupDTO[]> {
    user_id;
    return Promise.resolve([]);
  }

  public findWithName(name: string): Promise<BasicGroupDTO[]> {
    const groups_with_name: BasicGroupDTO[] = [];
    for (const group of this.groups.values()){
      if (group.name.includes(name)){
        groups_with_name.push(group as BasicGroupDTO);
      }
    }
    return Promise.resolve(groups_with_name);
  }

  public findbyCategory(category: string): Promise<BasicGroupDTO[]> {
    const groups_by_category: BasicGroupDTO[] = [];
    for (const group of this.groups.values()){
      if (group.category === category){
        groups_by_category.push(group as BasicGroupDTO);
      }
    }
    return Promise.resolve(groups_by_category);
  }

  public findAll(params: GroupQueryModel): Promise<GroupDTO[]> {
    params;
    throw new Error('Method not implemented.');
  }

  public delete(params: GroupQueryModel): Promise<GroupDTO> {
    params;
    throw new Error('Method not implemented.');
  }

  findAllWithRelation(params: GroupQueryModel): Promise<any> {
    params;
    throw new Error('Method not implemented.');
  }
}
