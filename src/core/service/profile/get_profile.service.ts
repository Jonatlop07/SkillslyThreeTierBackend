import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetProfileInteractor } from '@core/domain/profile/use-case/interactor/get_profile.interactor';
import GetProfileGateway from '@core/domain/profile/use-case/gateway/get_profile.gateway';
import GetProfileInputModel from '@core/domain/profile/use-case/input-model/get_profile.input_model';
import GetProfileOutputModel from '@core/domain/profile/use-case/output-model/get_profile.output_model';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ProfileNotFoundException } from '@core/domain/profile/use-case/exception/profile.exception';

@Injectable()
export class GetProfileService implements GetProfileInteractor {
  private readonly logger: Logger = new Logger(GetProfileService.name);

  constructor(
    @Inject(ProfileDITokens.ProfileRepository)
    private gateway: GetProfileGateway) {
  }

  async execute(input: GetProfileInputModel): Promise<GetProfileOutputModel> {
    const profile: ProfileDTO = await this.gateway.findOne({
      user_id: input.user_id
    });
    if (!profile) {
      throw new ProfileNotFoundException();
    }
    return {
      profile
    };
  }
}

