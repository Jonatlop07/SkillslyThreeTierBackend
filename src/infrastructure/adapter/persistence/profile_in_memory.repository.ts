import CreateProfileGateway from '@core/domain/profile/use-case/gateway/create_profile.gateway';
// import GetProfileGateway from '@core/domain/profile/use-case/gateway/get_profile.gateway';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';

export class ProfileInMemoryRepository implements CreateProfileGateway {
  private currently_available_profile_id: string;

  constructor(private readonly profiles: Map<string, ProfileDTO>) {
    this.currently_available_profile_id = '1';
  }

  async create(profile: ProfileDTO): Promise<ProfileDTO> {
    const newProfile: ProfileDTO = ({
      profileID: this.currently_available_profile_id,
      interests: profile.interests,
      activities: profile.activities,
      talents: profile.talents,
      knowledge: profile.knowledge,
      resume: profile.resume,
      userEmail: profile.userEmail,
    });
    this.profiles.set(this.currently_available_profile_id, newProfile);
    this.currently_available_profile_id = `${Number(this.currently_available_profile_id) + 1}`;
    return Promise.resolve(newProfile);
  }

  // get(userID: number): Profile {
  //   let query: Profile = undefined;
  //   this.profile.forEach((profile) => {
  //     if (profile.userID === userID) {
  //       query = profile;
  //     }
  //   });
  //   return query;
  // }
}