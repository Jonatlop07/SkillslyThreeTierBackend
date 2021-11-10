import CreateProfileGateway from '@core/domain/profile/use-case/gateway/create_profile.gateway';
import CreateProfileInputModel from '@core/domain/profile/input-model/create_profile.input_model';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/create_profile.interactor';
import { CreateProfileInvalidDataFormatException } from '@core/service/profile/create_profile.exception';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';

export class CreateProfileService implements CreateProfileInteractor {

  constructor(private gateway: CreateProfileGateway) {
  }

  async execute(input?: CreateProfileInputModel): Promise<CreateProfileOutputModel> {

    for (const key in input) {
      if (key !== 'resume' && key !== 'userEmail') {
        input[key].forEach((element) => {
          if (!this.isValidMember(element)) {
            throw new CreateProfileInvalidDataFormatException();
          }
        });
      }
    }
    const createdProfile: ProfileDTO = await this.gateway.create({
      resume: input['resume'],
      talents: input['talents'],
      activities: input['activities'],
      interests: input['interests'],
      knowledge: input['knowledge'],
      userEmail: input['userEmail'],
    });

    return Promise.resolve({
      resume: createdProfile.resume,
      knowledge: createdProfile.knowledge,
      talents: createdProfile.talents,
      activities: createdProfile.activities,
      interests: createdProfile.interests,
      userEmail: createdProfile.userEmail,
    });
  }

  private isValidMember(member) {
    return /^[A-Za-z]+$/.test(member);
  }
}