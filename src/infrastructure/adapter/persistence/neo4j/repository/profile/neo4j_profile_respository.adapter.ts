import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import ProfileRepository from '@core/domain/profile/use-case/repository/profile.repository';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';

@Injectable()
export class ProfileNeo4jRepositoryAdapter implements ProfileRepository {
  constructor(private readonly neo4j_service: Neo4jService) {}

  public async create(profile: ProfileDTO): Promise<ProfileDTO> {
    const user_key = 'user';
    const profile_key = 'profile';
    const create_profile_query = `
      CREATE (${profile_key} : Profile)
      SET ${profile_key} += $properties, ${profile_key}.profile_id = randomUUID()
      RETURN ${profile_key}
    `;
    const result_profile_creation = await this.neo4j_service.write(
      create_profile_query,
      {
        properties: {
          resume: profile.resume,
          knowledge: profile.knowledge,
          talents: profile.talents,
          activities: profile.activities,
          interests: profile.interests,
        },
      },
    );
    const result = this.neo4j_service.getSingleResultProperties(result_profile_creation, profile_key) as ProfileDTO;
    const create_relationship_query = `
      MATCH (${user_key}: User { email: "${profile.user_email}"}), (${profile_key}: Profile { profile_id: "${result.profile_id}" })
      CREATE (${user_key})-[:${Relationships.USER_PROFILE_RELATIONSHIP}]->(${profile_key})
    `;
    await this.neo4j_service.write(create_relationship_query, {});
    return result;
  }

  public async get(user_email: string): Promise<ProfileDTO> {
    const user_key = 'user';
    const profile_key = 'profile';
    const get_profile_query = ` 
      MATCH (${user_key} { email : '${user_email}' })--(${profile_key})
      RETURN ${profile_key}
    `;
    const get_profile_result = await this.neo4j_service.read(get_profile_query, {});
    return this.neo4j_service.getSingleResultProperties(get_profile_result, profile_key);
  }

  public async partialUpdate(old_profile: ProfileDTO, new_profile: Partial<ProfileDTO>): Promise<ProfileDTO> {
    const profile_key = 'profile';
    const edit_profile_data_query = `
      MATCH (${profile_key}: Profile { profile_id: "${old_profile.profile_id}" })
      SET ${profile_key} += $properties
      RETURN ${profile_key}
    `;
    const result_edit_profile_data = await this.neo4j_service.write(
      edit_profile_data_query,
      {
        properties: {
          ...new_profile,
        },
      },
    );
    return this.neo4j_service.getSingleResultProperties(result_edit_profile_data, profile_key);
  }
}
