import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/user.repository';
import { Optional } from '@core/common/type/common_types';
import { QueryResult } from 'neo4j-driver';
import * as moment from 'moment';

@Injectable()
export class UserNeo4jRepositoryAdapter implements UserRepository {
  private readonly logger: Logger = new Logger(UserNeo4jRepositoryAdapter.name);

  private getSingleResultProperties = (result: QueryResult, key: string) => {
    return result.records[0]?.get(key).properties;
  };

  constructor(private readonly neo4jService: Neo4jService) {}

  public async create(user: UserDTO): Promise<UserDTO> {
    const user_key = 'new_user';
    const createUserStatement = `
        CREATE (${user_key}: User)
        SET ${user_key} += $properties, ${user_key}.user_id = randomUUID()
        RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4jService.write(
      createUserStatement,
      {
        properties: {
          email: user.email,
          password: user.password,
          name: user.name,
          date_of_birth: user.date_of_birth,
          created_at: moment().local().format('YYYY-MM-DD HH:mm:ss')
        }
      });
    return this.getSingleResultProperties(result, user_key) as UserDTO;
  }

  public async exists(user: UserDTO): Promise<boolean> {
    const user_key = 'user';
    const exists_user_query = `MATCH (${user_key}: User { email: $email }) RETURN ${user_key}`;
    const result: QueryResult = await this.neo4jService.read(
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
    return this.getSingleResultProperties(
      await this.neo4jService.read(
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
    const result: QueryResult = await this.neo4jService.write(
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
    return this.getSingleResultProperties(result, user_key) as UserDTO;
  }

  async queryById(id: string): Promise<UserDTO> {
    const user_key = 'user';
    const user_query = `
      MATCH (${user_key}: User)
      WHERE ${user_key}.user_id = '${id}'
      RETURN ${user_key}
    `;
    const result: QueryResult = await this.neo4jService.read(user_query, {});
    return this.getSingleResultProperties(result, user_key);
  }
}
