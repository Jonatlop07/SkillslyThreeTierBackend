import { Interactor } from '@core/common/use-case/interactor';
import QueryTemporalPostInputModel from '@core/domain/temporal-post/use-case/input-model/query_temporal_post.input_model';
import QueryTemporalPostOutputModel
  from '@core/domain/temporal-post/use-case/output-model/query_temporal_post.output_model';

export interface QueryTemporalPostInteractor extends Interactor<QueryTemporalPostInputModel, QueryTemporalPostOutputModel> {
}
