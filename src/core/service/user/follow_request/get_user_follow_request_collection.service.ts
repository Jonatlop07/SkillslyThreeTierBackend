import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import GetUserFollowRequestCollectionGateway from '@core/domain/user/use-case/gateway/follow_request/get_user_follow_request.gateway';
import GetUserFollowRequestCollectionInputModel from '@core/domain/user/use-case/input-model/follow_request/get_user_follow_request_collection.input_model';
import { GetUserFollowRequestCollectionInteractor } from '@core/domain/user/use-case/interactor/follow_request/get_user_follow_request_collection.interactor';
import GetUserFollowRequestCollectionOutputModel from '@core/domain/user/use-case/output-model/follow_request/get_user_follow_request_collection.output_model';
import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetUserFollowRequestCollectionService implements GetUserFollowRequestCollectionInteractor {
  private readonly logger: Logger = new Logger(GetUserFollowRequestCollectionService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private user_gateway: GetUserFollowRequestCollectionGateway,
  ) { }

  async execute(
    input: GetUserFollowRequestCollectionInputModel,
  ): Promise<GetUserFollowRequestCollectionOutputModel> {
    const existsUser = await this.user_gateway.existsById(input.user_id);
    if (!existsUser) {
      throw new UserAccountNotFoundException();
    }
    const result = await this.user_gateway.getUserFollowRequestCollection(input);
    return result; 
  }
}