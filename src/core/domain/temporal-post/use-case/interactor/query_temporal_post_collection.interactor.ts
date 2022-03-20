import { Interactor } from '@core/common/use-case/interactor';
import QueryTemporalPostCollectionInputModel
  from '@core/domain/temporal-post/use-case/input-model/query_temporal_post_collection.input_model';
import QueryTemporalPostCollectionOutputModel
  from '@core/domain/temporal-post/use-case/output-model/query_temporal_post_collection.output_model';

export interface QueryTemporalPostCollectionInteractor
  extends Interactor<QueryTemporalPostCollectionInputModel, QueryTemporalPostCollectionOutputModel> {}
