import { GetProfileInteractor } from '@core/domain/profile/use-case/get_profile.interactor';
import GetProfileGateway from '@core/domain/profile/use-case/gateway/get_profile.gateway';
import GetProfileInputModel from '@core/domain/profile/input-model/get_profile.input_model';
import GetProfileOutputModel from '@core/domain/profile/use-case/output-model/get_profile.output_model';
import { isValidEmail } from '@core/common/util/account_data.validators';
import { CreateUserAccountInvalidDataFormatException } from '@core/service/user/create_user_account.exception';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ProfileNotExistsException } from '@core/service/profile/gett_profile.exception';


@Injectable()
export class GetProfileService implements GetProfileInteractor {
  constructor(
    @Inject(ProfileDITokens.ProfileRepository)
    private gateway: GetProfileGateway) {
  }

  async execute(input: GetProfileInputModel): Promise<GetProfileOutputModel> {

    const userEmail = input.userEmail;


    if (!isValidEmail(userEmail)) {
      throw new CreateUserAccountInvalidDataFormatException();
    }
    const profile: ProfileDTO = await this.gateway.get(userEmail);


    if (!profile) {
      throw new ProfileNotExistsException();
    }

    return {
      resume: profile.resume,
      knowledge: profile.knowledge,
      talents: profile.talents,
      activities: profile.activities,
      interests: profile.interests,
      profileID: profile.profileID,
    };
  }
}

