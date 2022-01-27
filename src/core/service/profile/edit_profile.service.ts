import { Inject, Injectable } from '@nestjs/common';
import { EditProfileInteractor } from '@core/domain/profile/use-case/interactor/edit_profile.interactor';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import EditProfileGateway from '@core/domain/profile/use-case/gateway/edit_profile_gateway';
import CreateProfileInputModel from '@core/domain/profile/use-case/input-model/create_profile.input_model';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { GetProfileInteractor } from '@core/domain/profile/use-case/interactor/get_profile.interactor';
import { ProfileEditEmptyInputException } from '@core/domain/profile/use-case/exception/profile.exception';

@Injectable()
export class EditProfileService implements EditProfileInteractor {
  constructor(
    @Inject(ProfileDITokens.ProfileRepository) private gateway: EditProfileGateway,
    @Inject(ProfileDITokens.GetProfileInteractor) private getProfileInteractor: GetProfileInteractor,
  ) {
  }

  async execute(input: Partial<CreateProfileInputModel>): Promise<CreateProfileOutputModel> {
    if (Object.keys(input).length === 0) {
      throw new ProfileEditEmptyInputException();
    }
    const oldProfile = await this.getProfileInteractor.execute({ user_id: input.user_id });
    const result = await this.gateway.partialUpdate(oldProfile, input);
    return Promise.resolve({
      resume: result.resume,
      user_id: result.user_id,
      interests: result.interests,
      activities: result.activities,
      talents: result.talents,
      knowledge: result.knowledge,
    });
  }
}
