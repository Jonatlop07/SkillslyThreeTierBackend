import {
  UserFollowRequestNotFoundException,
  UserFollowRequestInvalidDataFormatException
} from '@core/domain/user/use-case/exception/user_follow_request.exception';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { Inject, Logger } from '@nestjs/common';
import { UpdateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/update_user_follow_request.interactor';
import UpdateUserFollowRequestInputModel
  from '@core/domain/user/use-case/input-model/follow_request/update_user_follow_request.input_model';
import UpdateUserFollowRequestOutputModel
  from '@core/domain/user/use-case/output-model/follow_request/update_user_follow_request.output_model';
import UpdateUserFollowRequestGateway
  from '@core/domain/user/use-case/gateway/follow_request/update_user_follow_request.gateway';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';
import UserDetailsOutputModel from '@core/domain/user/use-case/output-model/user_details.output_model';

export class UpdateUserFollowRequestService implements UpdateUserFollowRequestInteractor {
  private readonly logger: Logger = new Logger(UpdateUserFollowRequestService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private user_gateway: UpdateUserFollowRequestGateway
  ) {
  }

  public async execute(input: UpdateUserFollowRequestInputModel): Promise<UpdateUserFollowRequestOutputModel> {
    const { user_id, user_to_follow_id, accept } = input;
    const requesting_user = await this.user_gateway.findOne({ user_id });
    if (!requesting_user)
      throw new UserAccountNotFoundException();
    const user_to_follow = await this.user_gateway.findOne({ user_id: user_to_follow_id });
    if (!user_to_follow)
      throw new UserAccountNotFoundException();
    const follow_request: FollowRequestDTO = {
      user_id,
      user_to_follow_id
    };
    const exists_user_follow_request = await this.user_gateway.existsUserFollowRequest(follow_request);
    if (!exists_user_follow_request)
      throw new UserFollowRequestNotFoundException();
    const is_valid_action = accept == true || accept == false;
    if (!is_valid_action)
      throw new UserFollowRequestInvalidDataFormatException();
    if (accept) {
      await this.user_gateway.acceptUserFollowRequest(follow_request);
    } else {
      await this.user_gateway.rejectUserFollowRequest(follow_request);
    }
    return requesting_user as UserDetailsOutputModel;
  }
}
