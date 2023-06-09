import { QueryTemporalPostInteractor } from '@core/domain/temporal-post/use-case/interactor/query_temporal_post.interactor';
import { TempPostDITokens } from '@core/domain/temporal-post/di/temp-post_di_tokens';
import QueryTemporalPostGateway from '@core/domain/temporal-post/use-case/gateway/query_temporal_post.gateway';

import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { Inject } from '@nestjs/common';
import QueryTemporalPostInputModel from '@core/domain/temporal-post/use-case/input-model/query_temporal_post.input_model';
import QueryTemporalPostOutputModel
  from '@core/domain/temporal-post/use-case/output-model/query_temporal_post.output_model';
import { NonExistentUserException } from '@core/domain/permanent-post/use-case/exception/permanent_post.exception';
import { TemporalPostDTO } from '@core/domain/temporal-post/use-case/persistence-dto/temporal_post.dto';
import { NotFoundTemporalPostException } from '@core/domain/temporal-post/use-case/exception/temporal_post.exception';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';

export class QueryTemporalPostService implements QueryTemporalPostInteractor {

  constructor(
    @Inject(TempPostDITokens.TempPostRepository)
    private readonly gateway: QueryTemporalPostGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly userGateway: SearchUsersGateway,
  ) {
  }

  async execute(input: QueryTemporalPostInputModel): Promise<QueryTemporalPostOutputModel> {
    const user = await this.userGateway.findOne({ user_id: input.owner_id });
    if (!user) {
      throw new NonExistentUserException();
    }
    const temporal_post: TemporalPostDTO = await this.gateway.findOne({
      temporal_post_id: input.temporal_post_id,
      owner_id: input.owner_id,
    });
    if (!temporal_post) {
      throw new NotFoundTemporalPostException();
    }
    return {
      temporal_post
    };
  }
}
