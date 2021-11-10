import ProfileRepository from '@core/domain/profile/use-case/profile.repository';
import { QueryResult } from 'neo4j-driver';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileNeo4jRepositoryAdapter implements ProfileRepository {

  private getSingleResultProperties = (result: QueryResult, key: string) => {
    return result.records[0]?.get(key).properties;
  };

  constructor(private readonly neo4jService: Neo4jService) {
  }

  public async create(profile: ProfileDTO): Promise<ProfileDTO> {
    const user_key = 'user';
    const profile_key = 'profile';
    const createProfileQuery = `
      CREATE (${profile_key} : Profile)
      SET ${profile_key} += $properties, ${profile_key}.profileID = randomUUID()
      RETURN ${profile_key}
    `;
    const resultProfileCreation = await this.neo4jService.write(
      createProfileQuery,
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

    const result = this.getSingleResultProperties(resultProfileCreation, profile_key) as ProfileDTO;


    const relationQuery = `
      MATCH ( ${user_key} : User {email : "${profile.userEmail}"}), ( ${profile_key} :Profile {profileID : "${result.profileID}"})
      CREATE (${user_key})-[r:HAS]->(${profile_key})
    `;

    await this.neo4jService.write(relationQuery, {});

    return result;
  }
}