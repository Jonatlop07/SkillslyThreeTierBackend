import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserFollowRequestGateway from '@core/domain/user/use-case/gateway/follow_request/create_user_follow_request.gateway';
import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/create_user_follow_request.input_model';
import { CreateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/create_user_follow_request.interactor';
import CreateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/create_user_follow_request.output_model';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserFollowRequestAlreadyExistsException, UserFollowRequestInvalidDataFormatException } from '@core/domain/user/use-case/exception/user_follow_request.exception';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';


@Injectable()
export class CreateUserFollowRequestService implements CreateUserFollowRequestInteractor {
  private readonly logger: Logger = new Logger(CreateUserFollowRequestService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private user_gateway: CreateUserFollowRequestGateway,
  ) { }

  async execute(
    input: CreateUserFollowRequestInputModel,
  ): Promise<CreateUserFollowRequestOutputModel> {
    const requestingUser = await this.user_gateway.findOne({ user_id: input.user_id });
    if (!requestingUser) {
      throw new UserAccountNotFoundException();
    }
    const destinyUser = await this.user_gateway.findOne({ user_id: input.user_destiny_id });
    if (!destinyUser) {
      throw new UserAccountNotFoundException();
    }
    if (input.user_id == input.user_destiny_id) {
      throw new UserFollowRequestInvalidDataFormatException();
    }
    const existsUserFollowRequest = await this.user_gateway.existsUserFollowRequest(input);
    if (existsUserFollowRequest) {
      throw new UserFollowRequestAlreadyExistsException();
    }
    await this.user_gateway.createUserFollowRequest(input);
    return requestingUser;
  }
}
