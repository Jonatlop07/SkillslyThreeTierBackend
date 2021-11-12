import { Interactor } from '@core/common/use-case/interactor';
import QueryPermanentPostInputModel from '../input-model/query_permanent_post.input_model';
import QueryPermanentPostOutputModel from './output-model/query_permanent_post.output_model';

export interface QueryPermanentPostInteractor
  extends Interactor<
  QueryPermanentPostInputModel,
  QueryPermanentPostOutputModel
  > {}
