import { Interactor } from '@core/common/use-case/interactor';
import QueryPermanentPostCollectionInputModel from '../input-model/query_permanent_post_collection.input_model';
import QueryPermanentPostCollectionOutputModel from './output-model/query_permanent_post_collection.output_model';

export interface QueryPermanentPostCollectionInteractor
  extends Interactor<
  QueryPermanentPostCollectionInputModel,
  QueryPermanentPostCollectionOutputModel
  > {}
