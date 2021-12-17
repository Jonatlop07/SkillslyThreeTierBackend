import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserFollowRequestGateway from '@core/domain/user/use-case/gateway/follow_request/create_user_follow_request.gateway';
import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/create_user_follow_request.input_model';
import { CreateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/create_user_follow_request.interactor';
import CreateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/create_user_follow_request.output_model';
import { Inject, Logger } from '@nestjs/common';
import { UserFollowRequestAlreadyExistsException, UserFollowRequestInvalidDataFormatException } from '@core/domain/user/use-case/exception/user_follow_request.exception';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';
import UserDetailsOutputModel from '@core/domain/user/use-case/output-model/user_details.output_model';

export class CreateUserFollowRequestService implements CreateUserFollowRequestInteractor {
  private readonly logger: Logger = new Logger(CreateUserFollowRequestService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private user_gateway: CreateUserFollowRequestGateway,
  ) {
  }

  public async execute(input: CreateUserFollowRequestInputModel): Promise<CreateUserFollowRequestOutputModel> {
    const { user_id, user_to_follow_id } = input;
    const requesting_user = await this.user_gateway.findOne({ user_id });
    if (!requesting_user)
      throw new UserAccountNotFoundException();
    const user_to_follow = await this.user_gateway.findOne({ user_id: user_to_follow_id });
    if (!user_to_follow)
      throw new UserAccountNotFoundException();
    if (user_id === user_to_follow_id)
      throw new UserFollowRequestInvalidDataFormatException();
    const follow_request: FollowRequestDTO = {
      user_id,
      user_to_follow_id
    };
    const exists_user_follow_request = await this.user_gateway.existsUserFollowRequest(follow_request);
    if (exists_user_follow_request)
      throw new UserFollowRequestAlreadyExistsException();
    await this.user_gateway.createUserFollowRequest(follow_request);
    return requesting_user as UserDetailsOutputModel;
  }
}
