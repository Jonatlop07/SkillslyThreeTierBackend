import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import GetUserFollowRequestCollectionGateway from '@core/domain/user/use-case/gateway/follow_request/get_user_follow_request.gateway';
import GetUserFollowRequestCollectionInputModel from '@core/domain/user/use-case/input-model/follow_request/get_user_follow_request_collection.input_model';
import { GetUserFollowRequestCollectionInteractor } from '@core/domain/user/use-case/interactor/follow_request/get_user_follow_request_collection.interactor';
import GetUserFollowRequestCollectionOutputModel from '@core/domain/user/use-case/output-model/follow_request/get_user_follow_request_collection.output_model';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetUserFollowRequestCollectionService implements GetUserFollowRequestCollectionInteractor {
  private readonly logger: Logger = new Logger(GetUserFollowRequestCollectionService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private user_gateway: GetUserFollowRequestCollectionGateway,
  ) { }

  public async execute(input: GetUserFollowRequestCollectionInputModel): Promise<GetUserFollowRequestCollectionOutputModel> {
    const existsUser = await this.user_gateway.exists({
      user_id: input.user_id
    });
    if (!existsUser) {
      throw new UserAccountNotFoundException();
    }
    const result = await this.user_gateway.getUserFollowRequestCollection(input.user_id);
    return {
      pendingUsers: result[0],
      followingUsers: result[1],
      followers: result[2],
      pendingSentUsers: result[3]
    };
  }
}
