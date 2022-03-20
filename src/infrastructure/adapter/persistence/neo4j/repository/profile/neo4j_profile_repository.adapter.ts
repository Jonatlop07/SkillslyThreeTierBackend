import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import ProfileRepository from '@core/domain/profile/use-case/repository/profile.repository';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { Relationships } from '@infrastructure/adapter/persistence/neo4j/constants/relationships';
import { ProfileQueryModel } from '@core/domain/profile/use-case/query-model/profile.query_model';
import CreateProfilePersistenceDTO from '@core/domain/profile/use-case/persistence-dto/create_profile.persistence_dto';

@Injectable()
export class ProfileNeo4jRepositoryAdapter implements ProfileRepository {
  constructor(private readonly neo4j_service: Neo4jService) {
  }

  public async create(profile: CreateProfilePersistenceDTO): Promise<ProfileDTO> {
    const user_key = 'user';
    const profile_key = 'profile';
    const create_profile_query = `
      MATCH (${user_key}: User { user_id: $user_id })
      CREATE (${profile_key}: Profile)
      SET ${profile_key} += $properties, ${profile_key}.profile_id = randomUUID()
      CREATE (${user_key})-[:${Relationships.USER_PROFILE_RELATIONSHIP}]->(${profile_key})
      RETURN ${profile_key}
    `;
    const created_profile = await this.neo4j_service.write(
      create_profile_query,
      {
        user_id: profile.user_id,
        properties: {
          resume: profile.resume,
          knowledge: profile.knowledge,
          talents: profile.talents,
          activities: profile.activities,
          interests: profile.interests,
        },
      },
    );
    return this.neo4j_service.getSingleResultProperties(created_profile, profile_key) as ProfileDTO;
  }

  public async findOne(input: ProfileQueryModel): Promise<ProfileDTO> {
    const user_key = 'user';
    const profile_key = 'profile';
    const get_profile_query = ` 
      MATCH (${user_key} :User { user_id : $user_id })--(${profile_key}: Profile)
      RETURN ${profile_key}
    `;
    const get_profile_result = await this.neo4j_service.read(get_profile_query, { user_id: input.user_id });
    return this.neo4j_service.getSingleResultProperties(get_profile_result, profile_key);
  }

  public async partialUpdate(old_profile: ProfileDTO, new_profile: Partial<ProfileDTO>): Promise<ProfileDTO> {
    delete new_profile.user_id;
    const profile_key = 'profile';
    const edit_profile_data_query = `
      MATCH (${profile_key}: Profile { profile_id: $profile_id })
      SET ${profile_key} += $properties
      RETURN ${profile_key}
    `;
    const result_edit_profile_data = await this.neo4j_service.write(
      edit_profile_data_query,
      {
        profile_id: old_profile.profile_id,
        properties: {
          ...new_profile,
        },
      },
    );
    return this.neo4j_service.getSingleResultProperties(result_edit_profile_data, profile_key);
  }
}
