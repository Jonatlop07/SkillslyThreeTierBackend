import { Inject, Injectable } from '@nestjs/common';
import { EditProfileInteractor } from '@core/domain/profile/use-case/interactor/edit_profile.interactor';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import EditProfileGateway from '@core/domain/profile/use-case/gateway/edit_profile_gateway';
import { GetProfileInteractor } from '@core/domain/profile/use-case/interactor/get_profile.interactor';
import { ProfileEditEmptyInputException } from '@core/domain/profile/use-case/exception/profile.exception';
import EditProfileInputModel from '@core/domain/profile/use-case/input-model/edit_profile.input_model';
import EditProfileOutputModel from '@core/domain/profile/use-case/output-model/edit_profile.output_model';

@Injectable()
export class EditProfileService implements EditProfileInteractor {
  constructor(
    @Inject(ProfileDITokens.ProfileRepository) private gateway: EditProfileGateway,
    @Inject(ProfileDITokens.GetProfileInteractor) private getProfileInteractor: GetProfileInteractor,
  ) {
  }

  async execute(input: Partial<EditProfileInputModel>): Promise<EditProfileOutputModel> {
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
