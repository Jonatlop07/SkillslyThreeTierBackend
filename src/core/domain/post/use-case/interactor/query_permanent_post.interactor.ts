import { Interactor } from '@core/common/use-case/interactor';
import QueryPermanentPostInputModel from '@core/domain/post/use-case/input-model/query_permanent_post.input_model';
import QueryPermanentPostOutputModel from '@core/domain/post/use-case/output-model/query_permanent_post.output_model';

export interface QueryPermanentPostInteractor
  extends Interactor<QueryPermanentPostInputModel, QueryPermanentPostOutputModel> {}
