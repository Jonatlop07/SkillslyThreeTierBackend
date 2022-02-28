import { Interactor } from '@core/common/use-case/interactor';
import QueryPermanentPostCollectionInputModel
  from '@core/domain/permanent-post/use-case/input-model/query_permanent_post_collection.input_model';
import QueryPermanentPostCollectionOutputModel
  from '@core/domain/permanent-post/use-case/output-model/query_permanent_post_collection.output_model';

export interface QueryPermanentPostCollectionInteractor
  extends Interactor<QueryPermanentPostCollectionInputModel, QueryPermanentPostCollectionOutputModel> {}
