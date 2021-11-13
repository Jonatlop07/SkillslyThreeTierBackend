import { Inject, Injectable } from '@nestjs/common';
import { EditProfileInteractor } from '@core/domain/profile/use-case/edit_profile.interactor';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import EditProfileGateway from '@core/domain/profile/use-case/gateway/edit_profile_gateway';
import CreateProfileInputModel from '@core/domain/profile/input-model/create_profile.input_model';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { GetProfileInteractor } from '@core/domain/profile/use-case/get_profile.interactor';

import { EditInputEmptyException } from '@core/service/profile/edit_profile.exception';


@Injectable()
export class EditProfileService implements EditProfileInteractor {
  constructor(
    @Inject(ProfileDITokens.ProfileRepository) private gateway: EditProfileGateway,
    @Inject(ProfileDITokens.GetProfileInteractor) private getProfileInteractor: GetProfileInteractor,
  ) {
  }


  async execute(input: Partial<CreateProfileInputModel>): Promise<CreateProfileOutputModel> {

    if (Object.keys(input).length === 0) {
      throw new EditInputEmptyException();
    }
    const oldProfile = await this.getProfileInteractor.execute({ userEmail: input.userEmail });
    const result = await this.gateway.update(oldProfile, input);
    return Promise.resolve({
      resume: result.resume,
      userEmail: result.userEmail,
      interests: result.interests,
      activities: result.activities,
      talents: result.talents,
      knowledge: result.knowledge,
    });
  }
}