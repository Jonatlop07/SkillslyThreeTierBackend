import { UserFollowRequestNotFoundException, UserFollowRequestInvalidDataFormatException } from '@core/domain/user/use-case/exception/user_follow_request.exception';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/update_user_follow_request.interactor';
import UpdateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/update_user_follow_request.input_model';
import UpdateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/update_user_follow_request.output_model';
import UpdateUserFollowRequestGateway from '@core/domain/user/use-case/gateway/follow_request/update_user_follow_request.gateway';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';


@Injectable()
export class UpdateUserFollowRequestService implements UpdateUserFollowRequestInteractor {
  private readonly logger: Logger = new Logger(UpdateUserFollowRequestService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private user_gateway: UpdateUserFollowRequestGateway,
  ) { }

  async execute(
    input: UpdateUserFollowRequestInputModel,
  ): Promise<UpdateUserFollowRequestOutputModel> {
    const existsUser = await this.user_gateway.existsById(input.user_id);
    if (!existsUser) {
      throw new UserAccountNotFoundException();
    }
    const existsDestinyUser = await this.user_gateway.existsById(input.user_destiny_id);
    if (!existsDestinyUser){
      throw new UserAccountNotFoundException();
    }
    const existsUserFollowRequest = await this.user_gateway.existsUserFollowRequest(input);
    if (!existsUserFollowRequest) {
      throw new UserFollowRequestNotFoundException();
    }
    const actionIsValid = input.action == 'accept' || input.action == 'reject'; 
    if (!actionIsValid) {
      throw new UserFollowRequestInvalidDataFormatException(); 
    }
    const result = await this.user_gateway.updateUserFollowRequest(input);
    return result; 
  }
}