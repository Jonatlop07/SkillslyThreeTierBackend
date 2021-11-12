import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/user.repository';
import { Optional } from '@core/common/type/common_types';
import { QueryResult } from 'neo4j-driver';
import * as moment from 'moment';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import userQuery_model from '@core/domain/user/use-case/query-model/user.query_model';

@Injectable()
export class UserNeo4jRepositoryAdapter implements UserRepository {
  private readonly logger: Logger = new Logger(UserNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4j_service: Neo4jService) {}
  findAll(params: userQuery_model): Promise<UserDTO[]> {
    throw new Error('Method not implemented.');
  }
  findOne(params: userQuery_model): Promise<UserDTO> {
    throw new Error('Method not implemented.');
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

  public async findOneByParam(param: string, value: any): Promise<Optional<UserDTO>> {
    const user_key = 'user';
    const formatted_value = typeof value === 'string' || value instanceof String ? `'${value}'` : value;
    const find_user_query = `
      MATCH (${user_key}: User { ${param}: ${formatted_value} })
      RETURN ${user_key}
    `;
    return this.neo4j_service.getSingleResultProperties(
      await this.neo4j_service.read(
        find_user_query,
        {}
      ),
      user_key
    );
  }

  async update(user: UserDTO): Promise<UserDTO> {
    const user_key = 'user';
    const update_user_statement = `
      MATCH (${user_key}: User)
      WHERE ${user_key}.user_id = '${user.user_id}'
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
      MATCH (${user_key}: User)
      WHERE ${user_key}.user_id = '${id}'
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.read(user_query, {});
    return this.neo4j_service.getSingleResultProperties(result, user_key);
  }

  async deleteById(id: string): Promise<UserDTO> {
    const user_key = 'user';
    const post_key = 'post';
    const user_query = `
      MATCH (${user_key}: User)-[:${Relationships.USER_POST_RELATIONSHIP}]->(${post_key}: PermanentPost)
      WHERE ${user_key}.user_id = '${id}'
      DETACH DELETE ${post_key}
      DETACH DELETE ${user_key}
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4j_service.write(user_query, {});
    return this.neo4j_service.getSingleResultProperties(result, user_key);
  }
}
