import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import ProfileRepository from '@core/domain/profile/use-case/repository/profile.repository';

export class ProfileInMemoryRepository implements ProfileRepository {
  private currently_available_profile_id: string;

  constructor(private readonly profiles: Map<string, ProfileDTO>) {
    this.currently_available_profile_id = '1';
  }

  async create(profile: ProfileDTO): Promise<ProfileDTO> {
    const new_profile: ProfileDTO = ({
      profile_id: this.currently_available_profile_id,
      interests: profile.interests,
      activities: profile.activities,
      talents: profile.talents,
      knowledge: profile.knowledge,
      resume: profile.resume,
      user_email: profile.user_email,
    });
    this.profiles.set(this.currently_available_profile_id, new_profile);
    this.currently_available_profile_id = `${Number(this.currently_available_profile_id) + 1}`;
    return Promise.resolve(new_profile);
  }

  async get(userEmail: string): Promise<ProfileDTO> {
    let query: ProfileDTO = undefined;
    this.profiles.forEach((profile) => {
      if (profile.user_email === userEmail) {
        query = profile;
      }
    });
    return Promise.resolve(query);
  }

  async partialUpdate(old_profile: ProfileDTO, new_profile: Partial<ProfileDTO>): Promise<ProfileDTO> {
    return Promise.resolve(Object.assign(old_profile, new_profile));
  }
}
