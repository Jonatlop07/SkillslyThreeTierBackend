  import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/repository/user.repository';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import * as moment from 'moment';
import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/create_user_follow_request.input_model';
import CreateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/create_user_follow_request.output_model';
import UpdateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/update_user_follow_request.input_model';
import UpdateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/update_user_follow_request.output_model';
import DeleteUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/delete_user_follow_request.input_model';
import DeleteUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/delete_user_follow_request.output_model';
import GetUserFollowRequestCollectionInputModel from '@core/domain/user/use-case/input-model/follow_request/get_user_follow_request_collection.input_model';
import GetUserFollowRequestCollectionOutputModel from '@core/domain/user/use-case/output-model/follow_request/get_user_follow_request_collection.output_model';

@Injectable()
export class UserNeo4jRepositoryAdapter implements UserRepository {
  private readonly logger: Logger = new Logger(UserNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {}
  delete(params: string): Promise<UserDTO> {
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
          (record:any) => record._fields[0].properties
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
    return this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.read(
        find_user_query,
        {
          properties: params
        }
      ),
      user_key
    );
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

  public async createUserFollowRequest(params: CreateUserFollowRequestInputModel): Promise<CreateUserFollowRequestOutputModel> {
    const user_key = 'user';
    const user_destiny_key = 'user_destiny'; 
    const create_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: '${params.user_id}' }) 
      MATCH (${user_destiny_key}: User { user_id: '${params.user_destiny_id}' })
      CREATE (${user_key})-[:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_destiny_key})
    `;
    await this.neo4j_service.write(
      create_user_follow_request_query,
      {}
    );
    return {}; 
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

  public async existsUserFollowRequest(params: CreateUserFollowRequestInputModel): Promise<boolean> {
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

  public async existsUserFollowRelationship(params: CreateUserFollowRequestInputModel): Promise<boolean> {
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

  public async updateUserFollowRequest(params: UpdateUserFollowRequestInputModel) : Promise<UpdateUserFollowRequestOutputModel> {
    const user_key = 'user';
    const user_destiny_key = 'user_destiny'; 
    const accept_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_destiny_key}: User { user_id: $user_destiny_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_destiny_key})
      DELETE r
      CREATE (${user_key})-[:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${user_destiny_key})
    `;
    const reject_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_destiny_key}: User { user_id: $user_destiny_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_destiny_key})
      DELETE r
    `;
    if (params.action == 'accept'){
      await this.neo4j_service.write(
        accept_user_follow_request_query,
        {
          user_id: params.user_id,
          user_destiny_id: params.user_destiny_id
        }
      );
    } else {
      await this.neo4j_service.write(
        reject_user_follow_request_query,
        {
          user_id: params.user_id,
          user_destiny_id: params.user_destiny_id
        }
      );
    }
    return {}; 
  }

  public async queryById(id: string): Promise<UserDTO> {
    const user_key = 'user';
    const user_query = `
      MATCH (${user_key}: User { user_id: $user_id })
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(user_query, { user_id: id });
    return this.neo4j_service.getSingleResultProperties(result, user_key);
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

  public async deleteUserFollowRequest(params: DeleteUserFollowRequestInputModel) : Promise<DeleteUserFollowRequestOutputModel>{
    const user_key = 'user';
    const user_destiny_key = 'user_destiny'; 
    const delete_user_follow_request_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_destiny_key}: User { user_id: $user_destiny_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(${user_destiny_key})
      DELETE r
    `;
    const delete_user_follow_relationship_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_destiny_key}: User { user_id: $user_destiny_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(${user_destiny_key})
      DELETE r
    `;
    if (params.action == 'request') {
      await this.neo4j_service.write(
        delete_user_follow_request_query,
        {
          user_id: params.user_id,
          user_destiny_id: params.user_destiny_id
        }
      );
    } else {
      await this.neo4j_service.write(
        delete_user_follow_relationship_query,
        {
          user_id: params.user_id,
          user_destiny_id: params.user_destiny_id
        }
      );
    }
    return {};
  }

  public async getUserFollowRequestCollection(params: GetUserFollowRequestCollectionInputModel): Promise<GetUserFollowRequestCollectionOutputModel> {
    const user_key = 'user';
    const get_user_follow_request_collection_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_REQUEST_RELATIONSHIP}]->(user_destiny)
      RETURN user_destiny
    `;
    const get_user_follow_relationship_collection_query = ` 
      MATCH (${user_key}: User { user_id: $user_id }),
      (${user_key})-[r:${Relationships.USER_FOLLOW_RELATIONSHIP}]->(user_destiny)
      RETURN user_destiny
    `;
    const result_request = await this.neo4j_service.read(
      get_user_follow_request_collection_query,
      {
        user_id: params.user_id
      }
    ).then(
      (result: QueryResult) =>
        result.records.map(
          (record:any) => record._fields[0].properties
        )
    );
    const request_resp = result_request.map((result: any) => {
      return ({
        email: result.email,
        name: result.name, 
        user_id: result.user_id, 
        date_of_birth: result.date_of_birth
      })
    });
    const result_relationship = await this.neo4j_service.read(
      get_user_follow_relationship_collection_query,
      {
        user_id: params.user_id
      }
    ).then(
      (result: QueryResult) =>
        result.records.map(
          (record:any) => record._fields[0].properties
        )
    );
    const relationship_resp = result_relationship.map((result: any) => {
      return ({
        email: result.email,
        name: result.name, 
        user_id: result.user_id, 
        date_of_birth: result.date_of_birth
      })
    });
    return {
      pendingUsers: relationship_resp,
      followingUsers: request_resp
    };
  }
}
