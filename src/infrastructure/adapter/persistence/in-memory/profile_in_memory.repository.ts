import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import ProfileRepository from '@core/domain/profile/use-case/repository/profile.repository';
import { ProfileQueryModel } from '@core/domain/profile/use-case/query-model/profile.query_model';
import CreateProfilePersistenceDTO from '@core/domain/profile/use-case/persistence-dto/create_profile.persistence_dto';

export class ProfileInMemoryRepository implements ProfileRepository {
  private currently_available_profile_id: string;

  constructor(private readonly profiles: Map<string, ProfileDTO>) {
    this.currently_available_profile_id = '1';
  }

  async create(profile: CreateProfilePersistenceDTO): Promise<ProfileDTO> {
    const new_profile: ProfileDTO = {
      profile_id: this.currently_available_profile_id,
      interests: profile.interests,
      activities: profile.activities,
      talents: profile.talents,
      knowledge: profile.knowledge,
      resume: profile.resume,
      user_id: profile.user_id,
    };
    this.profiles.set(this.currently_available_profile_id, new_profile);
    this.currently_available_profile_id = `${Number(this.currently_available_profile_id) + 1}`;
    return Promise.resolve(new_profile);
  }

  async findOne(input: ProfileQueryModel): Promise<ProfileDTO> {
    let query: ProfileDTO = undefined;
    this.profiles.forEach((profile) => {
      if (profile.user_id === input.user_id) {
        query = profile;
      }
    });
    return Promise.resolve(query);
  }

  findAll() {
    return null;
  }

  findAllWithRelation() {
    return null;
  }

  async partialUpdate(old_profile: ProfileDTO, new_profile: Partial<ProfileDTO>): Promise<ProfileDTO> {
    return Promise.resolve(Object.assign(old_profile, new_profile));
  }
}
