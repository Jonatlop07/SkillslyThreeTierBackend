import { Inject } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { TempPostDITokens } from '@core/domain/temporal-post/di/temp-post_di_tokens';
import { NonExistentUserException } from '@core/domain/permanent-post/use-case/exception/permanent_post.exception';
import { QueryTemporalPostFriendsCollectionInteractor } from '@core/domain/temporal-post/use-case/interactor/query_temporal_post_friends_collection.interactor';
import QueryTemporalPostFriendsCollectionOutputModel
  from '@core/domain/temporal-post/use-case/output-model/query_temporal_post_friends_collection.output_model';
import QueryTemporalPostFriendsCollectionInputModel
  from '@core/domain/temporal-post/use-case/input-model/query_temporal_post_friends_collection.input_model';
import QueryTemporalPostFriendsCollectionGateway
  from '@core/domain/temporal-post/use-case/gateway/query_temporal_post_friends_collection.gateway';

export class QueryTemporalPostFriendsCollectionService implements QueryTemporalPostFriendsCollectionInteractor {
  constructor(
    @Inject(TempPostDITokens.TempPostRepository)
    private readonly temp_post_gateway: QueryTemporalPostFriendsCollectionGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: SearchUsersGateway,
  ) {
  }

  public async execute(input: QueryTemporalPostFriendsCollectionInputModel): Promise<QueryTemporalPostFriendsCollectionOutputModel> {
    const { owner_id } = input;
    const owner = await this.user_gateway.findOne({ user_id: owner_id });
    if (!owner)
      throw new NonExistentUserException();
    return {
      temporal_post_friends_collection: await this.temp_post_gateway.findAllWithRelationship({ owner_id })
    };
  }
}
