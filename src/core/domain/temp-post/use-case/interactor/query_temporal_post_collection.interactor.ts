import { Interactor } from '@core/common/use-case/interactor';
import QueryTemporalPostCollectionInputModel
  from '@core/domain/temp-post/use-case/input-model/query_temporal_post_collection.input_model';
import { TemporalPostDTO } from '@core/domain/temp-post/use-case/persistence-dto/temporal_post.dto';

export interface QueryTemporalPostCollectionInteractor extends Interactor<QueryTemporalPostCollectionInputModel, Array<TemporalPostDTO>> {
}