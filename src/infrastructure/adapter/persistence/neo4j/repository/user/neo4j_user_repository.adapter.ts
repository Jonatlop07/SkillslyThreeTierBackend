import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserRepository from '@core/domain/user/use-case/user.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { QueryResult } from 'neo4j-driver';
import * as moment from 'moment';

@Injectable()
export class UserNeo4jRepositoryAdapter implements UserRepository {
  private readonly logger: Logger = new Logger(UserNeo4jRepositoryAdapter.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async create(user: UserDTO): Promise<UserDTO> {
    const createUserStatement = `
        CREATE (new_user: User)
        SET new_user += $properties, new_user.user_id = randomUUID()
        RETURN new_user
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
    return result.records[0]?.get('new_user').properties as UserDTO;
  }


  async exists(user: UserDTO): Promise<boolean> {
    const existsUserQuery = 'MATCH (user: User { email: $email }) RETURN user';
    const result: QueryResult = await this.neo4jService.read(
      existsUserQuery,
      { email: user.email }
    );
    return result.records.length > 0;
  }
}
