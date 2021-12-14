import { QueryTemporalPostInteractor } from '@core/domain/temp-post/use-case/interactor/query_temporal_post.interactor';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import QueryTemporalPostGateway from '@core/domain/temp-post/use-case/gateway/query_temporal_post.gateway';

import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { Inject } from '@nestjs/common';
import QueryTemporalPostInputModel from '@core/domain/temp-post/use-case/input-model/query_temporal_post.input_model';
import QueryTemporalPostOutputModel
  from '@core/domain/temp-post/use-case/output-model/query_temporal_post.output_model';
import { NonExistentUserException } from '@core/domain/post/use-case/exception/permanent_post.exception';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import { NotFoundTemporalPostException } from '@core/domain/temp-post/use-case/exception/temp-post.exception';
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
    const user = await this.userGateway.findOne({ user_id: input.user_id });
    if (!user) {
      throw new NonExistentUserException();
    }
    const queryTempPost: TemporalPostDTO = await this.gateway.findOne({
      temporal_post_id: input.temporal_post_id,
      user_id: input.user_id,
    });
    if (!queryTempPost) {
      throw new NotFoundTemporalPostException();
    }
    return queryTempPost as QueryTemporalPostOutputModel;
  }

}