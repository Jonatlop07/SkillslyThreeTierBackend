import CreateProfileGateway from '@core/domain/profile/use-case/gateway/create_profile.gateway';
import { Profile } from '@core/domain/profile/entity/profile';
import GetProfileGateway from '@core/domain/profile/use-case/gateway/get_profile.gateway';

export class ProfileInMemoryRepository implements CreateProfileGateway, GetProfileGateway {
  private currently_avaible_profile_id: number;

  constructor(private readonly profiles: Map<number, Profile>) {
    this.currently_avaible_profile_id = 1;
  }

  create(profile: Profile): Profile {
    const newProfile = new Profile({
      id: this.currently_avaible_profile_id,
      interests: profile.interests,
      activities: profile.activities,
      talents: profile.talents,
      knowledge: profile.knowledge,
      resume: profile.resume,
      userID: profile.userID,
    });
    this.profiles.set(this.currently_avaible_profile_id, newProfile);
    this.currently_avaible_profile_id += 1;
    return newProfile;
  }

  get(userID: number): Profile {
    let query: Profile = undefined;
    this.profiles.forEach((profile) => {
      if (profile.userID === userID) {
        query = profile;
      }
    });
    return query;
  }
}