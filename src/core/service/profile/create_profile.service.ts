import CreateProfileGateway from '@core/domain/profile/use-case/gateway/create_profile.gateway';
import CreateProfileInputModel from '@core/domain/profile/input-model/create_profile.input_model';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { Profile } from '@core/domain/profile/entity/profile';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/create_profile.interactor';
import { CreateProfileInvalidDataFormatException } from '@core/service/profile/create_profile.exception';

export class CreateProfileService implements CreateProfileInteractor {

  constructor(private gateway: CreateProfileGateway) {
  }

  async execute(input?: CreateProfileInputModel): Promise<CreateProfileOutputModel> {
    const profile = new Profile(input);
    for (const key in profile) {
      if (key !== '_resume' && key !== 'id') {
        profile[key].forEach((element) => {
          if (!this.isValidMember(element)) {
            throw new CreateProfileInvalidDataFormatException();
          }
        });
      }
    }
    const createdProfile: Profile = await this.gateway.create(profile);
    return Promise.resolve({
      resume: createdProfile.resume,
      knowledge: createdProfile.knowledge,
      talents: createdProfile.talents,
      activities: createdProfile.activities,
      interests: createdProfile.interests,
    });
  }

  private isValidMember(member) {
    return /^[A-Za-z]+$/.test(member);
  }
}