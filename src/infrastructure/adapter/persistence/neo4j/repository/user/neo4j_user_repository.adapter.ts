import { Injectable, Logger } from '@nestjs/common';
import { QueryResult } from 'neo4j-driver';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/repository/user.repository';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import * as moment from 'moment';

@Injectable()
export class UserNeo4jRepositoryAdapter implements UserRepository {
  private readonly logger: Logger = new Logger(UserNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {}

  public async findAll(params: UserQueryModel): Promise<Array<UserDTO>> {
    const { email, name } = params;
    const user_key = 'user';
    const find_user_query = `
      MATCH (${user_key}: User)
      WHERE ${user_key}.email = '${email}' OR ${user_key}.name = '${name}' 
      RETURN ${user_key}
    `;
    return await this.neo4j_service.read(
      find_user_query,
      {}
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

  async update(user: UserDTO): Promise<UserDTO> {
    const user_key = 'user';
    const update_user_statement = `
      MATCH (${user_key}: User { user_id: '${user.user_id}' })
      SET ${user_key} += $properties
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(
      update_user_statement,
      {
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

  async queryById(id: string): Promise<UserDTO> {
    const user_key = 'user';
    const user_query = `
      MATCH (${user_key}: User { user_id: '${id}' })
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(user_query, {});
    return this.neo4j_service.getSingleResultProperties(result, user_key);
  }

  async deleteById(id: string): Promise<UserDTO> {
    const user_key = 'user';
    const post_key = 'post';
    const profile_key = 'profile';
    const delete_user_statement = `
      MATCH (${user_key}: User { user_id: '${id}' })
      WITH ${user_key}
      OPTIONAL MATCH (${user_key})-[:${Relationships.USER_POST_RELATIONSHIP}]->(${post_key}: PermanentPost)
      DETACH DELETE ${post_key}
      WITH ${user_key}
      OPTIONAL MATCH (${user_key})-[:${Relationships.USER_PROFILE_RELATIONSHIP}]->(${profile_key}: Profile)
      DETACH DELETE ${profile_key}
      DETACH DELETE ${user_key}
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(delete_user_statement, {});
    return this.neo4j_service.getSingleResultProperties(result, user_key);
  }
}
