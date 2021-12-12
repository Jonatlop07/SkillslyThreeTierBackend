import { QueryTemporalPostInteractor } from '@core/domain/temp-post/use-case/interactor/query_temporal_post.interactor';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import { Inject } from '@nestjs/common';
import QueryTemporalPostGateway from '@core/domain/temp-post/use-case/gateway/query_temporal_post.gateway';
import DeleteTemporalPostGateway from '@core/domain/temp-post/use-case/gateway/delete_temporal_post.gateway';
import QueryTemporalPostInputModel from '@core/domain/temp-post/use-case/input-model/query_temporal_post.input_model';
import QueryTemporalPostOutputModel
  from '@core/domain/temp-post/use-case/output-model/query_temporal_post.output_model';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import { NotFoundTemporalPostException } from '@core/domain/temp-post/use-case/exception/temp-post.exception';

export class DeleteTemporalPostService implements QueryTemporalPostInteractor {

  constructor(
    @Inject(TempPostDITokens.TempPostRepository)
    private readonly queryGateway: QueryTemporalPostGateway,
    @Inject(TempPostDITokens.TempPostRepository)
    private readonly deleteGateway: DeleteTemporalPostGateway,
  ) {
  }

  async execute(input: QueryTemporalPostInputModel): Promise<QueryTemporalPostOutputModel> {

    const queryTempPost: TemporalPostDTO = await this.queryGateway.findOne(input);
    if (!queryTempPost) {
      throw new NotFoundTemporalPostException();
    }

    const deletedTempPost: TemporalPostDTO = await this.deleteGateway.deleteById(input.temporal_post_id);
    return deletedTempPost as QueryTemporalPostOutputModel;
  }


}