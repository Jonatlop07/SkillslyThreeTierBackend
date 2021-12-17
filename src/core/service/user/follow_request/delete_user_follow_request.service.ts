import { Inject, Logger } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import {
  UserFollowRelationshipNotFoundException,
  UserFollowRequestInvalidDataFormatException,
  UserFollowRequestNotFoundException
} from '@core/domain/user/use-case/exception/user_follow_request.exception';
import DeleteUserFollowRequestGateway from '@core/domain/user/use-case/gateway/follow_request/delete_user_follow_request.gateway';
import DeleteUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/delete_user_follow_request.input_model';
import { DeleteUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/delete_user_follow_request.interactor';
import DeleteUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/delete_user_follow_request.output_model';
import UserDetailsOutputModel from '@core/domain/user/use-case/output-model/user_details.output_model';

export class DeleteUserFollowRequestService implements DeleteUserFollowRequestInteractor {
  private readonly logger: Logger = new Logger(DeleteUserFollowRequestService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private user_gateway: DeleteUserFollowRequestGateway,
  ) {
  }

  public async execute(input: DeleteUserFollowRequestInputModel): Promise<DeleteUserFollowRequestOutputModel> {
    const { user_id, user_to_follow_id, is_request } = input;
    const requesting_user = await this.user_gateway.findOne({ user_id });
    if (!requesting_user)
      throw new UserAccountNotFoundException();
    const user_to_follow = await this.user_gateway.findOne({ user_id: user_to_follow_id });
    if (!user_to_follow)
      throw new UserAccountNotFoundException();
    const follow_request = { user_id, user_to_follow_id };
    const exists_user_follow_request = await this.user_gateway.existsUserFollowRequest(follow_request);
    if (!exists_user_follow_request && is_request)
      throw new UserFollowRequestNotFoundException();
    const exists_user_follow_relationship = await this.user_gateway.existsUserFollowRelationship(follow_request);
    if (!exists_user_follow_relationship && !is_request)
      throw new UserFollowRelationshipNotFoundException();
    const is_valid_action = is_request == true || is_request == false;
    if (!is_valid_action)
      throw new UserFollowRequestInvalidDataFormatException();
    if (is_request) {
      await this.user_gateway.deleteUserFollowRequest(follow_request);
    } else {
      await this.user_gateway.deleteUserFollowRelationship(follow_request);
    }
    return requesting_user as UserDetailsOutputModel;
  }
}
