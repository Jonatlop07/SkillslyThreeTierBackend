import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/repository/user.repository';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';
import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';
import { Role } from '@core/domain/user/entity/type/role.enum';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { AddCustomerDetailsDTO } from '@core/domain/user/use-case/persistence-dto/add_customer_details.dto';
import { UpdateUserRolesDTO } from '@core/domain/user/use-case/persistence-dto/update_user_roles.dto';
import { PartialUserUpdateDTO } from '@core/domain/user/use-case/persistence-dto/partial_user_update.dto';

@Injectable()
export class UserNeo4jRepositoryAdapter implements UserRepository {
  private readonly logger: Logger = new Logger(UserNeo4jRepositoryAdapter.name);

  private readonly user_key = 'user';
  private readonly user_to_follow_key = 'user_to_follow';

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  delete(params: string): Promise<UserDTO> {
    params;
    throw new Error('Method not implemented.');
  }

  public async findAll(params: UserQueryModel): Promise<Array<UserDTO>> {
    const { email, name } = params;
    const find_user_query = `
      MATCH (${this.user_key}: User)
      WHERE ${this.user_key}.email CONTAINS $email OR ${this.user_key}.name CONTAINS $name 
      RETURN ${this.user_key}
    `;
    return this.neo4j_service.getMultipleResultByKey(
      await this.neo4j_service.read(
        find_user_query,
        {
          email,
          name
        }
      ),
      this.user_key
    );
  }

  public async findOne(params: UserQueryModel): Promise<UserDTO> {
    const find_user_query = `
      MATCH (${this.user_key}: User)
      WHERE ALL(k in keys($properties) WHERE $properties[k] = ${this.user_key}[k])
      RETURN ${this.user_key}
    `;
    const found_user: UserDTO = this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.read(
        find_user_query,
        {
          properties: params
        }
      ),
      this.user_key
    );
    if (!found_user) {
      return null;
    }
    return {
      ...found_user,
      roles: await this.getRoles(found_user.user_id)
    };
  }

  private async getRoles(user_id: string): Promise<Array<Role>> {
    const roles = [Role.User];
    if (await this.hasInvestorRole(user_id))
      roles.push(Role.Investor);
    if (await this.hasRequesterRole(user_id))
      roles.push(Role.Requester);
    return roles;
  }

  private async hasInvestorRole(user_id: string): Promise<boolean> {
    const has_investor_role_query = `
      MATCH (${this.user_key}: Investor { user_id: $user_id })
      RETURN ${this.user_key}
    `;
    const has_investor_query_result = await this.neo4j_service.read(
      has_investor_role_query,
      { user_id }
    );
    return has_investor_query_result.records.length > 0;
  }

  private async hasRequesterRole(user_id: string): Promise<boolean> {
    const has_requester_role_query = `
      MATCH (${this.user_key}: Requester { user_id: $user_id })
      RETURN ${this.user_key}
    `;
    const has_requester_query_result = await this.neo4j_service.read(
      has_requester_role_query,
      { user_id }
    );
    return has_requester_query_result.records.length > 0;
  }

  public findAllWithRelation() {
    return null;
  }

  public async create(user: UserDTO): Promise<UserDTO> {
    const investor_label = user.roles.includes(Role.Investor) ? ': Investor' : '';
    const requester_label = user.roles.includes(Role.Requester) ? ': Requester' : '';
    const create_user_statement = `
      CREATE (${this.user_key}: User ${investor_label} ${requester_label})
      SET ${this.user_key} += $properties, ${this.user_key}.user_id = randomUUID()
      RETURN ${this.user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      create_user_statement,
      {
        properties: {
          email: user.email,
          password: user.password,
          name: user.name,
          date_of_birth: user.date_of_birth,
          is_two_factor_auth_enabled: false,
          created_at: getCurrentDate()
        }
      });
    return this.neo4j_service.getSingleResultProperties(result, this.user_key) as UserDTO;
  }

  public async createUserFollowRequest(params: FollowRequestDTO): Promise<void> {
    const create_user_follow_request_query = ` 
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${this.user_to_follow_key}: User { user_id: $user_to_follow_id })
      CREATE (${this.user_key})-[:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${this.user_to_follow_key})
      RETURN ${this.user_key}
    `;
    await this.neo4j_service.write(
      create_user_follow_request_query,
      {
        user_id: params.user_id,
        user_to_follow_id: params.user_to_follow_id
      }
    );
  }

  public async exists(user: UserDTO): Promise<boolean> {
    const exists_user_query = `MATCH (${this.user_key}: User { email: $email }) RETURN ${this.user_key}`;
    const result: QueryResult = await this.neo4j_service.read(
      exists_user_query,
      { email: user.email }
    );
    return result.records.length > 0;
  }

  public async existsById(id: string): Promise<boolean> {
    const exists_user_query = `MATCH (${this.user_key}: User { user_id: $id }) RETURN ${this.user_key}`;
    const result: QueryResult = await this.neo4j_service.read(
      exists_user_query,
      { id }
    );
    return result.records.length > 0;
  }

  public async existsUserFollowRequest(params: FollowRequestDTO): Promise<boolean> {
    const exists_user_follow_request_query = ` 
      MATCH (${this.user_key}: User { user_id: $user_id }) , 
      (${this.user_to_follow_key}: User { user_id: $user_to_follow_id }), 
      (${this.user_key})-[r: ${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${this.user_to_follow_key})
      RETURN r
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_user_follow_request_query,
      {
        user_id: params.user_id,
        user_to_follow_id: params.user_to_follow_id
      }
    );
    return result.records.length > 0;
  }

  public async existsUserFollowRelationship(params: FollowRequestDTO): Promise<boolean> {
    const exists_user_follow_request_query = ` 
      MATCH (${this.user_key}: User { user_id: $user_id }) , 
      (${this.user_to_follow_key}: User { user_id: $user_to_follow_id }), 
      (${this.user_key})-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${this.user_to_follow_key})
      RETURN r
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_user_follow_request_query,
      {
        user_id: params.user_id,
        user_to_follow_id: params.user_to_follow_id
      }
    );
    return result.records.length > 0;
  }

  public async update(user: UserDTO): Promise<UserDTO> {
    const update_user_statement = `
      MATCH (${this.user_key}: User { user_id: $user_id })
      SET ${this.user_key} += $properties
      RETURN ${this.user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      update_user_statement,
      {
        user_id: user.user_id,
        properties: {
          email: user.email,
          password: user.password,
          name: user.name,
          date_of_birth: user.date_of_birth,
          is_two_factor_auth_enabled: user.is_two_factor_auth_enabled,
          updated_at: getCurrentDate()
        }
      }
    );
    return this.neo4j_service.getSingleResultProperties(result, this.user_key) as UserDTO;
  }

  public async acceptUserFollowRequest(params: FollowRequestDTO): Promise<void> {
    const accept_user_follow_request_query = ` 
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${this.user_to_follow_key}: User { user_id: $user_to_follow_id }),
      (${this.user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${this.user_to_follow_key})
      DELETE r
      CREATE (${this.user_key})-[:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${this.user_to_follow_key})
    `;
    await this.neo4j_service.write(
      accept_user_follow_request_query,
      {
        user_id: params.user_id,
        user_to_follow_id: params.user_to_follow_id
      }
    );
  }

  public async rejectUserFollowRequest(params: FollowRequestDTO): Promise<void> {
    const reject_user_follow_request_query = ` 
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${this.user_to_follow_key}: User { user_id: $user_to_follow_id }),
      (${this.user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${this.user_to_follow_key})
      DELETE r
    `;
    await this.neo4j_service.write(
      reject_user_follow_request_query,
      {
        user_id: params.user_id,
        user_to_follow_id: params.user_to_follow_id
      }
    );
  }

  public async queryById(id: string): Promise<UserDTO> {
    const user_key = 'user';
    const user_query = `
      MATCH (${user_key}: User { user_id: $user_id })
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(user_query, { user_id: id });
    return {
      ...this.neo4j_service.getSingleResultProperties(result, user_key),
      roles: [Role.User]
    };
  }

  public async deleteById(id: string): Promise<UserDTO> {
    const post_key = 'post';
    const profile_key = 'profile';
    const user_conversation_relationship = 'belongs_to_c';
    const conversation_key = 'conversation';
    const delete_user_statement = `
      MATCH (${this.user_key}: User { user_id: $user_id })
      WITH ${this.user_key}
      OPTIONAL MATCH (${this.user_key})-[:${Relationships.USER_POST_RELATIONSHIP}]->(${post_key}: PermanentPost)
      DETACH DELETE ${post_key}
      WITH ${this.user_key}
      OPTIONAL MATCH (${this.user_key})-[:${Relationships.USER_PROFILE_RELATIONSHIP}]->(${profile_key}: Profile)
      DETACH DELETE ${profile_key}
      DETACH DELETE ${this.user_key}
      WITH ${this.user_key}
      OPTIONAL MATCH (${this.user_key})
        -[${user_conversation_relationship}:${Relationships.USER_CONVERSATION_RELATIONSHIP}
        ->(${conversation_key}: Conversation)
      DELETE ${user_conversation_relationship}
      RETURN ${this.user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(delete_user_statement, { user_id: id });
    return this.neo4j_service.getSingleResultProperties(result, this.user_key);
  }

  public async deleteUserFollowRequest(params: FollowRequestDTO): Promise<void> {
    const delete_user_follow_request_query = ` 
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${this.user_to_follow_key}: User { user_id: $user_to_follow_id }),
      (${this.user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${this.user_to_follow_key})
      DELETE r
    `;
    await this.neo4j_service.write(
      delete_user_follow_request_query,
      {
        user_id: params.user_id,
        user_to_follow_id: params.user_to_follow_id
      }
    );
  }

  public async deleteUserFollowRelationship(params: FollowRequestDTO): Promise<void> {
    const delete_user_follow_relationship_query = ` 
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${this.user_to_follow_key}: User { user_id: $user_to_follow_id }),
      (${this.user_key})-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${this.user_to_follow_key})
      DELETE r
    `;
    await this.neo4j_service.write(
      delete_user_follow_relationship_query,
      {
        user_id: params.user_id,
        user_to_follow_id: params.user_to_follow_id
      }
    );
  }

  public async getUserFollowRequestCollection(id: string): Promise<Array<Array<SearchedUserDTO>>> {
    const map_nodes_properties = (result: QueryResult) =>
      result.records.map(
        (record: any) => record._fields[0].properties
      );
    const map_user_data = (result: any) => ({
      email: result.email,
      user_id: result.user_id,
      date_of_birth: result.date_of_birth,
      name: result.name
    });
    const other_user_key = 'other_user';
    const get_user_follow_request_collection_query = `
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${other_user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${this.user_key})
      RETURN ${other_user_key}
    `;
    const get_following_users_query = `
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${this.user_key})-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${other_user_key})
      RETURN ${other_user_key}
    `;
    const get_followers_query = `
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${this.user_key})<-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]-(${other_user_key})
      RETURN ${other_user_key}
    `;
    const get_user_follow_request_sent_collection_query = ` 
      MATCH (${this.user_key}: User { user_id: $user_id }),
      (${this.user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${other_user_key})
      RETURN ${other_user_key}
    `;
    const result_request = await this.neo4j_service.read(
      get_user_follow_request_collection_query,
      {
        user_id: id
      }
    ).then(map_nodes_properties);
    const mapped_result_request = result_request.map(map_user_data);
    const following_users = await this.neo4j_service.read(
      get_following_users_query,
      {
        user_id: id
      }
    ).then(map_nodes_properties);
    const mapped_following_users = following_users.map(map_user_data);
    const followers = await this.neo4j_service.read(
      get_followers_query,
      {
        user_id: id
      }
    ).then(map_nodes_properties);
    const mapped_followers = followers.map(map_user_data);
    const result_request_sent = await this.neo4j_service.read(
      get_user_follow_request_sent_collection_query,
      {
        user_id: id
      }
    ).then(map_nodes_properties);
    const mapped_result_request_sent = result_request_sent.map(map_user_data);
    return [
      mapped_result_request_sent,
      mapped_following_users,
      mapped_followers,
      mapped_result_request
    ];
  }

  public async addCustomerDetails(customer_details: AddCustomerDetailsDTO): Promise<string> {
    const { user_id, customer_id } = customer_details;
    const customer_key = 'customer';
    const make_customer_statement = `
      MATCH (${this.user_key}: User { user_id: $user_id })
      SET ${this.user_key}.customer_id = $customer_id
      RETURN ${this.user_key}.customer_id as ${customer_key}
    `;
    return this.neo4j_service.getSingleResultProperty(
      await this.neo4j_service.write(make_customer_statement, { user_id, customer_id }),
      customer_key
    );
  }

  public async updateUserRoles(user_roles: UpdateUserRolesDTO): Promise<Array<Role>> {
    const { user_id, requester, investor } = user_roles;
    const roles: Array<Role> = [];
    const update_user_roles_statement = `
      MATCH (${this.user_key}: User { user_id: $user_id })
      ${requester ? `SET ${this.user_key}: Requester` : '' }
      ${investor ? `SET ${this.user_key}: Investor` : '' }
      RETURN ${this.user_key}
    `;
    await this.neo4j_service.write(update_user_roles_statement, {
      user_id
    });
    if (requester)
      roles.push(Role.Requester);
    if (investor)
      roles.push(Role.Investor);
    return roles;
  }

  public async partialUpdate(params: UserQueryModel, updates: PartialUserUpdateDTO): Promise<UserDTO> {
    const update_user_statement = `
      MATCH (${this.user_key})
      WHERE ALL(k in keys($params) WHERE $params[k] = ${this.user_key}[k])
      SET ${this.user_key} += $properties
      RETURN ${this.user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      update_user_statement,
      {
        params,
        properties: {
          ...updates
        }
      }
    );
    return this.neo4j_service.getSingleResultProperties(result, this.user_key) as UserDTO;
  }
}

