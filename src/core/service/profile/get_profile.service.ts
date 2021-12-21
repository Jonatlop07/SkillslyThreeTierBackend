import { Inject, Injectable, Logger } from '@nestjs/common';
import { isValidEmail } from '@core/common/util/validators/account_data.validators';
import { GetProfileInteractor } from '@core/domain/profile/use-case/interactor/get_profile.interactor';
import GetProfileGateway from '@core/domain/profile/use-case/gateway/get_profile.gateway';
import GetProfileInputModel from '@core/domain/profile/use-case/input-model/get_profile.input_model';
import GetProfileOutputModel from '@core/domain/profile/use-case/output-model/get_profile.output_model';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { UserAccountInvalidDataFormatException } from '@core/domain/user/use-case/exception/user_account.exception';
import { ProfileNotFoundException } from '@core/domain/profile/use-case/exception/profile.exception';

@Injectable()
export class GetProfileService implements GetProfileInteractor {
  private readonly logger: Logger = new Logger(GetProfileService.name);

  constructor(
    @Inject(ProfileDITokens.ProfileRepository)
    private gateway: GetProfileGateway) {
  }

  async execute(input: GetProfileInputModel): Promise<GetProfileOutputModel> {
    const user_email = input.user_email;
    if (!isValidEmail(user_email)) {
      throw new UserAccountInvalidDataFormatException();
    }
    const profile: ProfileDTO = await this.gateway.get(user_email);
    if (!profile) {
      throw new ProfileNotFoundException();
    }
    return {
      resume: profile.resume,
      knowledge: profile.knowledge,
      talents: profile.talents,
      activities: profile.activities,
      interests: profile.interests,
      profile_id: profile.profile_id,
    };
  }
}

