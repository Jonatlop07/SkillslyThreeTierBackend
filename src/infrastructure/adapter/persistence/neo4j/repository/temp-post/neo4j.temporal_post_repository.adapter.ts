import TemporalPostRepository from '@core/domain/temp-post/use-case/repository/temporal_post.repository';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import { QueryResult } from 'neo4j-driver';
import * as moment from 'moment';

@Injectable()
export class TemporalPostNeo4jRepositoryAdapter implements TemporalPostRepository {

  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(temp_post: TemporalPostDTO): Promise<TemporalPostDTO> {
    const temp_post_key = 'tempPost';
    const user_key = 'user';

    const create_temp_post_query = `
      MATCH (${user_key}: User {user_id: $user_id})
      CREATE (${temp_post_key}: TemporalPost)
      SET ${temp_post_key} += $properties, ${temp_post_key}.temporal_post_id = randomUUID()
      CREATE (${user_key})-[:${Relationships.USER_TEMP_POST_RELATIONSHIP}]->(${temp_post_key})
      RETURN ${temp_post_key}
    `;

    const result: QueryResult = await this.neo4j_service.write(
      create_temp_post_query,
      {
        user_id: temp_post.user_id,
        properties: {
          description: temp_post.description,
          reference: temp_post.reference,
          referenceType: temp_post.referenceType,
          created_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
          expires_at: moment().add(24, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
        },
      });

    const created_temp_post = this.neo4j_service.getSingleResultProperties(result, temp_post_key);

    return {
      temporal_post_id: created_temp_post.temporal_post_id,
      description: created_temp_post.description,
      reference: created_temp_post.reference,
      referenceType: created_temp_post.referenceType,
      user_id: temp_post.user_id,
      created_at: created_temp_post.created_at,
      expires_at: created_temp_post.expires_at,
    };
  }

  public delete() {
    return null;
  }

  public deleteById() {
    return null;
  }

  public findOne() {
    return null;
  }

  public findAll() {
    return null;
  }


}