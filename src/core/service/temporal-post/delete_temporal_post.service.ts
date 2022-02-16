import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import { Inject } from '@nestjs/common';
import DeleteTemporalPostGateway from '@core/domain/temp-post/use-case/gateway/delete_temporal_post.gateway';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';
import { NotFoundTemporalPostException } from '@core/domain/temp-post/use-case/exception/temporal_post.exception';
import DeleteTemporalPostInputModel from '@core/domain/temp-post/use-case/input-model/delete_temporal_post.input_model';
import DeleteTemporalPostOutputModel
  from '@core/domain/temp-post/use-case/output-model/delete_temporal_post.output_model';
import { DeleteTemporalPostInteractor } from '@core/domain/temp-post/use-case/interactor/delete_temporal_post.interactor';

export class DeleteTemporalPostService implements DeleteTemporalPostInteractor {

  constructor(
    @Inject(TempPostDITokens.TempPostRepository)
    private readonly gateway: DeleteTemporalPostGateway,
  ) {
  }

  public async execute(input: DeleteTemporalPostInputModel): Promise<DeleteTemporalPostOutputModel> {
    const { temporal_post_id } = input;
    const temporal_post: TemporalPostDTO = await this.gateway.findOne({
      temporal_post_id
    });
    if (!temporal_post) {
      throw new NotFoundTemporalPostException();
    }
    await this.gateway.deleteById(temporal_post_id);
    return {
      deleted_temporal_post: temporal_post
    };
  }
}
