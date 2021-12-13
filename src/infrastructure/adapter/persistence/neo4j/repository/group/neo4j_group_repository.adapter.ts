import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import GroupRepository from '@core/domain/group/use-case/repository/group.repository';
import { GroupDTO } from '@core/domain/group/use-case/persistence-dto/group.dto';
import { Relationships } from '../../constants/relationships';
import { QueryResult } from 'neo4j-driver-core';
import GroupQueryModel from '@core/domain/group/use-case/query-model/group.query_model';
import { JoinRequestDTO } from '@core/domain/group/use-case/persistence-dto/join_request.dto';
import { BasicGroupDTO } from '@core/domain/group/use-case/persistence-dto/basic_group_data.dto';
import { PaginationDTO } from '@application/api/http-rest/http-dtos/pagination.dto';
import { GroupUserDTO } from '@core/domain/group/use-case/persistence-dto/group_users.dto';

@Injectable()
export class GroupNeo4jRepositoryAdapter implements GroupRepository {
  private readonly logger: Logger = new Logger(
    GroupNeo4jRepositoryAdapter.name,
  );

  private readonly group_key = 'group';
  private readonly user_key = 'user';

  constructor(private readonly neo4j_service: Neo4jService) {}
  
  async findOne(params: GroupQueryModel): Promise<GroupDTO> {
    const { group_id } = params;
    const find_group_query = `
      MATCH (${this.group_key}:Group { group_id:$group_id })
      RETURN ${this.group_key}
    `;
    const query_result = await this.neo4j_service.read(find_group_query, { group_id });
    const found_group = this.neo4j_service.getSingleResultProperties(query_result, this.group_key);
    if (!found_group){
      return undefined;
    }
    return {
      id: found_group.group_id,
      name: found_group.name,
      description: found_group.description,
      category: found_group.category,
      picture: found_group.picture
    };
  }

  async findUserGroups(user_id: string, pagination: PaginationDTO): Promise<BasicGroupDTO[]> {
    const { limit, offset } = pagination;
    const find_user_groups_query = `
      MATCH (${this.user_key}:User { user_id:$user_id })
      -[:${Relationships.USER_JOINED_GROUP_RELATIONSHIP}|${Relationships.USER_ADMINS_GROUP_RELATIONSHIP}]
      ->(${this.group_key}:Group)
      RETURN DISTINCT ${this.group_key}
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result = await this.neo4j_service
      .read(find_user_groups_query, { user_id })
      .then((result: QueryResult) => 
        result.records.map((record:any) => record._fields[0].properties));

    return result.map((group) => ({
      id: group.group_id,
      name: group.name,
      description: group.description,
      picture: group.picture
    }));
  }

  async queryUsers(group_id: string, pagination: PaginationDTO): Promise<GroupUserDTO[]> {
    const { limit, offset } = pagination;
    const query_group_users = `
      MATCH (${this.user_key}: User)
      -[:${Relationships.USER_JOINED_GROUP_RELATIONSHIP}|${Relationships.USER_ADMINS_GROUP_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      RETURN DISTINCT ${this.user_key}
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result = await this.neo4j_service
      .read(query_group_users, { group_id })
      .then((result: QueryResult) => 
        result.records.map((record:any) => record._fields[0].properties));

    return result.map((user) => ({
      user_id: user.user_id,
      user_name: user.name,
      user_email: user.email,
    }));
  }

  async getJoinRequests(group_id: string, pagination: PaginationDTO): Promise<JoinRequestDTO[]> {
    const { limit, offset } = pagination;
    const get_join_requests_query = `
      MATCH (${this.user_key}: User)
      -[:${Relationships.USER_JOIN_GROUP_REQUEST_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      RETURN ${this.user_key}
      SKIP ${offset}
      LIMIT ${limit}
    `;
    const result = await this.neo4j_service
      .read(get_join_requests_query, { group_id })
      .then((result: QueryResult) => 
        result.records.map((record:any) => record._fields[0].properties));

    return result.map((user) => ({
      user_id: user.user_id,
      user_name: user.name,
      user_email: user.email,
    }));
  }

  async findWithName(name: string, pagination: PaginationDTO): Promise<BasicGroupDTO[]> {
    const { limit, offset } = pagination;
    const find_with_name_query = `
      MATCH (${this.group_key}:Group)
      WHERE ${this.group_key}.name CONTAINS $name
      RETURN ${this.group_key}
      SKIP ${offset}
      LIMIT ${limit}
    `;

    const result = await this.neo4j_service
      .read(find_with_name_query, { name })
      .then((result: QueryResult) => 
        result.records.map((record:any) => record._fields[0].properties));

    return result.map((group) => ({
      id: group.group_id,
      name: group.name,
      description: group.description,
      picture: group.picture
    }));
  }


  async findbyCategory(category: string, pagination: PaginationDTO): Promise<BasicGroupDTO[]> {
    const { limit, offset } = pagination;
    const find_by_category_query = `
      MATCH (${this.group_key}:Group { category:$category })
      RETURN ${this.group_key}
      SKIP ${offset}
      LIMIT ${limit}
    `;

    const result = await this.neo4j_service
      .read(find_by_category_query, { category })
      .then((result: QueryResult) => 
        result.records.map((record:any) => record._fields[0].properties));

    return result.map((group) => ({
      id: group.group_id,
      name: group.name,
      description: group.description,
      picture: group.picture
    }));

  }

  async leaveGroup(param: GroupQueryModel): Promise<BasicGroupDTO> {
    const { group_id, user_id } = param;
    const leave_group_query = 
    `
    MATCH (${this.user_key}:User { user_id:$user_id })
    -[r:${Relationships.USER_JOINED_GROUP_RELATIONSHIP}|${Relationships.USER_ADMINS_GROUP_RELATIONSHIP}]
    ->(${this.group_key}:Group { group_id:$group_id })
    WITH ${this.user_key}, ${this.group_key}, r
    DELETE r
    RETURN ${this.user_key}.user_id as user, ${this.group_key}.group_id as group
    `;

    const result = await this.neo4j_service.write(leave_group_query, { user_id, group_id });
    return { 
      user_id: this.neo4j_service.getSingleResultProperty(result, 'user'),
      group_id: this.neo4j_service.getSingleResultProperty(result, 'group')
    };
  }

  async groupHasMoreOwners(group_id: string): Promise<boolean> {
    const check_if_more_than_one_owner_query = `
      MATCH (${this.user_key}:User)-[:${Relationships.USER_ADMINS_GROUP_RELATIONSHIP}]->(${this.group_key}:Group { groud_id:$group_id })
      RETURN COUNT(${this.user_key}) as num_owners
      `;
    const result = await this.neo4j_service.read(check_if_more_than_one_owner_query, { group_id });
    const num_of_owners = this.neo4j_service.getSingleResultProperty(result, 'num_owners');
    return num_of_owners > 1;    
  }

  async acceptUserJoinGroupRequest(params: GroupQueryModel): Promise<JoinRequestDTO> {
    const { user_id, group_id } = params;
    const accept_join_request_query = `
      MATCH (${this.user_key}:User { user_id:$user_id })
      -[r:${Relationships.USER_JOIN_GROUP_REQUEST_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      WITH ${this.user_key}, ${this.group_key}, r
      DELETE r
      CREATE (${this.user_key})-[:${Relationships.USER_JOINED_GROUP_RELATIONSHIP}]->(${this.group_key})
      RETURN ${this.group_key}.group_id as group, ${this.user_key}.user_id as user
    `;
    const result = await this.neo4j_service.write(accept_join_request_query, { user_id, group_id });
    return {
      user_id: this.neo4j_service.getSingleResultProperty(result, 'user'),
      group_id: this.neo4j_service.getSingleResultProperty(result, 'group')
    };
  }
  async rejectUserJoinGroupRequest(params: GroupQueryModel): Promise<JoinRequestDTO> {
    const { user_id, group_id } = params;
    const reject_join_request_query = `
      MATCH (${this.user_key}:User { user_id:$user_id })
      -[r:${Relationships.USER_JOIN_GROUP_REQUEST_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      WITH ${this.user_key}, ${this.group_key}, r
      DELETE r
      RETURN ${this.group_key}.group_id as group, ${this.user_key}.user_id as user
    `;
    const result = await this.neo4j_service.write(reject_join_request_query, { user_id, group_id });
    return {
      user_id: this.neo4j_service.getSingleResultProperty(result, 'user'),
      group_id: this.neo4j_service.getSingleResultProperty(result, 'group')
    };
  }

  async removeUserFromGroup(params: GroupQueryModel): Promise<JoinRequestDTO> {
    const { user_id, group_id } = params;
    const remove_group_user_query = `
      MATCH (${this.user_key}:User { user_id:$user_id })
      -[r:${Relationships.USER_JOINED_GROUP_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      WITH ${this.user_key}, ${this.group_key}, r
      DELETE r
      RETURN ${this.group_key}.group_id as group, ${this.user_key}.user_id as user
    `;
    const result = await this.neo4j_service.write(remove_group_user_query, { user_id, group_id });
    return {
      user_id: this.neo4j_service.getSingleResultProperty(result, 'user'),
      group_id: this.neo4j_service.getSingleResultProperty(result, 'group')
    };
  }

  async deleteJoinRequest(params: JoinRequestDTO): Promise<JoinRequestDTO> {
    const { user_id, group_id } = params;
    const delete_join_request_query = `
      MATCH (${this.user_key}:User { user_id:$user_id })
      -[rel:${Relationships.USER_JOIN_GROUP_REQUEST_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      WITH ${this.group_key}.group_id as group_id, ${this.user_key}.user_id as user_id, rel
      DELETE rel
      RETURN group_id, user_id
    `;

    const result = await this.neo4j_service.write(delete_join_request_query, { user_id, group_id });
    return {
      user_id: this.neo4j_service.getSingleResultProperty(result, 'user_id'),
      group_id: this.neo4j_service.getSingleResultProperty(result, 'group_id')
    };
  }

  async existsJoinRequest(param: GroupQueryModel): Promise<boolean> {
    const { user_id, group_id } = param;
    const exists_join_request_query = `
      MATCH (${this.user_key}:User { user_id:$user_id })
      -[r:${Relationships.USER_JOIN_GROUP_REQUEST_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      RETURN r
    `;

    const result = await this.neo4j_service.read(exists_join_request_query, { user_id, group_id });
    return result.records.length > 0;
  }

  async existsGroupUserRelationship(param: GroupQueryModel): Promise<boolean> { 
    const { user_id, group_id } = param;
    const exists_group_user_query = `
      MATCH (${this.user_key}:User { user_id:$user_id })
      -[r:${Relationships.USER_JOINED_GROUP_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      RETURN r
    `;

    const result = await this.neo4j_service.read(exists_group_user_query, { user_id, group_id });
    return result.records.length > 0;
  }
  
  async createJoinRequest(params: JoinRequestDTO): Promise<JoinRequestDTO> {
    const { user_id, group_id } = params;
    const create_join_request_query = `
      MATCH (${this.user_key}:User { user_id: $user_id }), 
            (${this.group_key}: Group { group_id: $group_id })
      CREATE (${this.user_key})-[:${Relationships.USER_JOIN_GROUP_REQUEST_RELATIONSHIP}]->(${this.group_key})
      RETURN ${this.user_key}.user_id as user, ${this.group_key}.group_id as group
    `;

    const result = await this.neo4j_service.write(create_join_request_query, { user_id, group_id });
    return {
      user_id: this.neo4j_service.getSingleResultProperty(result, 'user'),
      group_id: this.neo4j_service.getSingleResultProperty(result, 'group')
    };
  }

  async deleteById(id: string): Promise<GroupDTO> {
    const delete_group_query = `
      MATCH (${this.group_key}:Group {group_id:$id})
      WITH ${this.group_key}, properties(${this.group_key}) as props
      DETACH DELETE ${this.group_key}
      RETURN props
    `;
    const result = await this.neo4j_service.write(delete_group_query, { id });
    const deleted_group = this.neo4j_service.getSingleResultProperty(result, 'props');
    return {
      id: deleted_group.group_id,
      name: deleted_group.name,
      description: deleted_group.description,
      category: deleted_group.category,
      picture: deleted_group.picture,
    };
  }

  public async update(group: GroupDTO): Promise<GroupDTO> {
    const { id, name, description, category, picture } = group;
    const update_group_query = `
      MATCH (${this.group_key}:Group { group_id:$id })
      SET ${this.group_key} += $properties
      RETURN ${this.group_key}
    `;
    const result = await this.neo4j_service.write(update_group_query, {
      id,
      properties: {
        name,
        description,
        category,
        picture,
      },
    });
    const updated_group = this.neo4j_service.getSingleResultProperties(
      result,
      this.group_key,
    );
    return {
      id: updated_group.group_id,
      name: updated_group.name,
      description: updated_group.description,
      category: updated_group.category,
      picture: updated_group.picture,
    };
  }

  async userIsOwner(params: GroupQueryModel): Promise<boolean> {
    const { group_id, user_id } = params;
    const check_if_group_owner_query = `
      MATCH (${this.user_key}:User { user_id:$user_id })
      -[:${Relationships.USER_ADMINS_GROUP_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      RETURN ${this.user_key}
    `;
    const query_result: QueryResult = await this.neo4j_service.read(
      check_if_group_owner_query,
      { user_id: user_id, group_id: group_id },
    );
    return query_result.records.length > 0;
  }

  async userIsMember(param: GroupQueryModel): Promise<boolean> {
    const { group_id, user_id } = param;
    const check_if_member_query = `
      MATCH (${this.user_key}:User { user_id:$user_id })
      -[:${Relationships.USER_JOINED_GROUP_RELATIONSHIP}]
      ->(${this.group_key}:Group { group_id:$group_id })
      RETURN ${this.user_key}      
    `;
    const result = await this.neo4j_service.read(check_if_member_query, { user_id, group_id });
    return result.records.length > 0;
  }

  public async create(group: GroupDTO): Promise<GroupDTO> {
    const { owner_id, name, description, category } = group;
    const picture = group.picture ? group.picture : '';
    const create_group_statement = `
      MATCH (${this.user_key}:User {user_id:$owner_id})
      CREATE (${this.group_key}: Group)
      SET ${this.group_key} += $properties, ${this.group_key}.group_id = randomUUID()
      CREATE (${this.user_key})-[:${Relationships.USER_ADMINS_GROUP_RELATIONSHIP}]->(${this.group_key})
      RETURN ${this.group_key}
    `;
    const create_result: QueryResult = await this.neo4j_service.write(
      create_group_statement,
      {
        owner_id,
        properties: {
          name,
          description,
          category,
          picture,
        },
      },
    );

    const created_group = this.neo4j_service.getSingleResultProperties(
      create_result,
      this.group_key,
    );
    return {
      id: created_group.group_id,
      name: created_group.name,
      description: created_group.description,
      category: created_group.category,
      picture: created_group.picture,
    };
  }

  delete(params: GroupQueryModel): Promise<GroupDTO> {
    throw new Error('Method not implemented.');
  }

  findAll(params: GroupQueryModel): Promise<GroupDTO[]> {
    throw new Error('Method not implemented.');
  }
}
