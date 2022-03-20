import { Inject, Injectable } from '@nestjs/common';
import { isValidMember } from '@core/common/util/validators/profile.validators';
import CreateProfileGateway from '@core/domain/profile/use-case/gateway/create_profile.gateway';
import CreateProfileInputModel from '@core/domain/profile/use-case/input-model/create_profile.input_model';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/interactor/create_profile.interactor';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ProfileInvalidDataFormatException } from '@core/domain/profile/use-case/exception/profile.exception';

@Injectable()
export class CreateProfileService implements CreateProfileInteractor {

  constructor(
    @Inject(ProfileDITokens.ProfileRepository)
    private gateway: CreateProfileGateway) {
  }

  async execute(input: CreateProfileInputModel): Promise<CreateProfileOutputModel> {
    for (const key in input) {
      if (key !== 'resume' && key !== 'user_id') {
        input[key].forEach((element) => {
          if (!isValidMember(element)) {
            throw new ProfileInvalidDataFormatException();
          }
        });
      }
    }
    const createdProfile: ProfileDTO = await this.gateway.create({
      resume: input.resume,
      talents: input.talents,
      activities: input.activities,
      interests: input.interests,
      knowledge: input.knowledge,
      user_id: input.user_id,
    });

    return Promise.resolve({
      resume: createdProfile.resume,
      knowledge: createdProfile.knowledge,
      talents: createdProfile.talents,
      activities: createdProfile.activities,
      interests: createdProfile.interests,
      user_id: createdProfile.user_id,
    });
  }
}
