import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/repository/user.repository';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import * as moment from 'moment';
import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';
import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';
import { Role } from '@core/domain/user/entity/role.enum';

@Injectable()
export class UserNeo4jRepositoryAdapter implements UserRepository {
  private readonly logger: Logger = new Logger(UserNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  delete(params: string): Promise<UserDTO> {
    params;
    throw new Error('Method not implemented.');
  }

  public async findAll(params: UserQueryModel): Promise<Array<UserDTO>> {
    const { email, name } = params;
    const user_key = 'user';
    const find_user_query = `
      MATCH (${user_key}: User)
      WHERE ${user_key}.email CONTAINS $email OR ${user_key}.name CONTAINS $name 
      RETURN ${user_key}
    `;
    return await this.neo4j_service.read(
      find_user_query,
      {
        email,
        name
      }
    ).then(
      (result: QueryResult) =>
        result.records.map(
          (record: any) => record._fields[0].properties
        )
    );
  }

  public async findOne(params: UserQueryModel): Promise<UserDTO> {
    const user_key = 'user';
    const find_user_query = `
      MATCH (${user_key}: User)
      WHERE ALL(k in keys($properties) WHERE $properties[k] = ${user_key}[k])
      RETURN ${user_key}
    `;
    return {
      ...this.neo4j_service.getSingleResultProperties(
        await this.neo4j_service.read(
          find_user_query,
          {
            properties: params
          }
        ),
        user_key
      ),
      roles: [Role.User]
    };
  }

  public async create(user: UserDTO): Promise<UserDTO> {
    const user_key = 'new_user';
    const create_user_statement = `
      CREATE (${user_key}: User)
      SET ${user_key} += $properties, ${user_key}.user_id = randomUUID()
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      create_user_statement,
      {
        properties: {
          email: user.email,
          password: user.password,
          name: user.name,
          date_of_birth: user.date_of_birth,
          created_at: moment().local().format('YYYY/MM/DD HH:mm:ss')
        }
      });
    return this.neo4j_service.getSingleResultProperties(result, user_key) as UserDTO;
  }

  public async createUserFollowRequest(params: FollowRequestDTO): Promise<void> {
    const user_key = 'user';
    const user_destiny_key = 'user_destiny';
    const create_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: '${params.user_id}' }) 
      MATCH (${user_destiny_key}: User { user_id: '${params.user_destiny_id}' })
      CREATE (${user_key})-[:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_destiny_key})
      RETURN ${user_key}
    `;
    await this.neo4j_service.write(
      create_user_follow_request_query,
      {}
    );
  }


  public async exists(user: UserDTO): Promise<boolean> {
    const user_key = 'user';
    const exists_user_query = `MATCH (${user_key}: User { email: $email }) RETURN ${user_key}`;
    const result: QueryResult = await this.neo4j_service.read(
      exists_user_query,
      { email: user.email }
    );
    return result.records.length > 0;
  }

  public async existsById(id: string): Promise<boolean> {
    const user_key = 'user';
    const exists_user_query = `MATCH (${user_key}: User { user_id: $id }) RETURN ${user_key}`;
    const result: QueryResult = await this.neo4j_service.read(
      exists_user_query,
      { id: id }
    );
    return result.records.length > 0;
  }

  public async existsUserFollowRequest(params: FollowRequestDTO): Promise<boolean> {
    const user_key = 'user';
    const user_destiny_key = 'user_destiny';
    const exists_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }) , 
      (${user_destiny_key}: User { user_id: $user_destiny_id }), 
      (${user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_destiny_key})
      RETURN r
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_user_follow_request_query,
      {
        user_id: params.user_id,
        user_destiny_id: params.user_destiny_id
      }
    );
    return result.records.length > 0;
  }

  public async existsUserFollowRelationship(params: FollowRequestDTO): Promise<boolean> {
    const user_key = 'user';
    const user_destiny_key = 'user_destiny';
    const exists_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }) , 
      (${user_destiny_key}: User { user_id: $user_destiny_id }), 
      (${user_key})-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${user_destiny_key})
      RETURN r
    `;
    const result: QueryResult = await this.neo4j_service.read(
      exists_user_follow_request_query,
      {
        user_id: params.user_id,
        user_destiny_id: params.user_destiny_id
      }
    );
    return result.records.length > 0;
  }

  public async update(user: UserDTO): Promise<UserDTO> {
    const user_key = 'user';
    const update_user_statement = `
      MATCH (${user_key}: User { user_id: $user_id })
      SET ${user_key} += $properties
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      update_user_statement,
      {
        user_id: user.user_id,
        properties: {
          user_id: user.user_id,
          email: user.email,
          password: user.password,
          name: user.name,
          date_of_birth: user.date_of_birth,
          updated_at: moment().local().format('YYYY/MM/DD HH:mm:ss')
        }
      }
    );
    return this.neo4j_service.getSingleResultProperties(result, user_key) as UserDTO;
  }

  public async acceptUserFollowRequest(params: FollowRequestDTO) : Promise<void> {
    const user_key = 'user';
    const user_destiny_key = 'user_destiny';
    const accept_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_destiny_key}: User { user_id: $user_destiny_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_destiny_key})
      DELETE r
      CREATE (${user_key})-[:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${user_destiny_key})
    `;
    await this.neo4j_service.write(
      accept_user_follow_request_query,
      {
        user_id: params.user_id,
        user_destiny_id: params.user_destiny_id
      }
    );
  }

  public async rejectUserFollowRequest(params: FollowRequestDTO) : Promise<void> {
    const user_key = 'user';
    const user_destiny_key = 'user_destiny';
    const reject_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_destiny_key}: User { user_id: $user_destiny_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_destiny_key})
      DELETE r
    `;
    await this.neo4j_service.write(
      reject_user_follow_request_query,
      {
        user_id: params.user_id,
        user_destiny_id: params.user_destiny_id
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
    const user_key = 'user';
    const post_key = 'post';
    const profile_key = 'profile';
    const user_conversation_relationship = 'belongs_to_c';
    const conversation_key = 'conversation';
    const delete_user_statement = `
      MATCH (${user_key}: User { user_id: $user_id })
      WITH ${user_key}
      OPTIONAL MATCH (${user_key})-[:${Relationships.USER_POST_RELATIONSHIP}]->(${post_key}: PermanentPost)
      DETACH DELETE ${post_key}
      WITH ${user_key}
      OPTIONAL MATCH (${user_key})-[:${Relationships.USER_PROFILE_RELATIONSHIP}]->(${profile_key}: Profile)
      DETACH DELETE ${profile_key}
      DETACH DELETE ${user_key}
      WITH ${user_key}
      OPTIONAL MATCH (${user_key})
        -[${user_conversation_relationship}:${Relationships.USER_CONVERSATION_RELATIONSHIP}
        ->(${conversation_key}: Conversation)
      DELETE ${user_conversation_relationship}
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(delete_user_statement, { user_id: id });
    return this.neo4j_service.getSingleResultProperties(result, user_key);
  }

  public async deleteUserFollowRequest(params: FollowRequestDTO) : Promise<void>{
    const user_key = 'user';
    const user_destiny_key = 'user_destiny';
    const delete_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_destiny_key}: User { user_id: $user_destiny_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_destiny_key})
      DELETE r
    `;
    await this.neo4j_service.write(
      delete_user_follow_request_query,
      {
        user_id: params.user_id,
        user_destiny_id: params.user_destiny_id
      }
    );
  }

  public async deleteUserFollowRelationship(params: FollowRequestDTO): Promise<void> {
    const user_key = 'user';
    const user_destiny_key = 'user_destiny';
    const delete_user_follow_relationship_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_destiny_key}: User { user_id: $user_destiny_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${user_destiny_key})
      DELETE r
    `;
    await this.neo4j_service.write(
      delete_user_follow_relationship_query,
      {
        user_id: params.user_id,
        user_destiny_id: params.user_destiny_id
      }
    );
  }

  public async getUserFollowRequestCollection(id: string): Promise<Array<Array<SearchedUserDTO>>> {
    const map_nodes_properties = (result: QueryResult) =>
      result.records.map(
        (record: any) => record._fields[0].properties
      );
    const map_user_data = (result:any) => ({
      email: result.email,
      user_id: result.user_id,
      date_of_birth: result.date_of_birth,
      name: result.name
    });
    const user_key = 'user';
    const other_user_key = 'other_user';
    const get_user_follow_request_collection_query = `
      MATCH (${user_key}: User { user_id: $user_id }),
      (${other_user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_key})
      RETURN ${other_user_key}
    `;
    const get_following_users_query = `
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${other_user_key})
      RETURN ${other_user_key}
    `;
    const get_followers_query = `
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_key})<-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]-(${other_user_key})
      RETURN ${other_user_key}
    `;
    const get_user_follow_request_sent_collection_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${other_user_key})
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
}

