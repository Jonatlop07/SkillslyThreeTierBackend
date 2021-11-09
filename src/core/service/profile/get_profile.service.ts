import { GetProfileInteractor } from '@core/domain/profile/use-case/get_profile.interactor';
import GetProfileGateway from '@core/domain/profile/use-case/gateway/get_profile.gateway';
import GetProfileInputModel from '@core/domain/profile/input-model/get_profile.input_model';
import GetProfileOutputModel from '@core/domain/profile/use-case/output-model/get_profile.output_model';
import { GetProfileInvalidDataFormatException } from '@core/service/profile/get_profile.exception';

export class GetProfileService implements GetProfileInteractor {
  constructor(private gateway: GetProfileGateway) {
  }

  async execute(input?: GetProfileInputModel): Promise<GetProfileOutputModel> {
    const userID = input.userID;
    if (!this.isNumber(userID)) {
      throw new GetProfileInvalidDataFormatException();
    }
    const profile = await this.gateway.get(userID);
    return Promise.resolve({
      resume: profile.resume,
      knowledge: profile.knowledge,
      talents: profile.talents,
      activities: profile.activities,
      interests: profile.interests,
    });
  }

  private isNumber(member) {
    return /^[0-9]*$/.test(member);
  }
}

