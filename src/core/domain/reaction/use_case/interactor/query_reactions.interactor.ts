import { Interactor } from '@core/common/use-case/interactor';
import QueryReactionsInputModel from '../../input-model/query_reactions.output_model';
import { QueryReactionsOutputModel } from '../output-model/query_reactions.output_model';

export interface QueryReactionsInteractor extends Interactor<QueryReactionsInputModel, QueryReactionsOutputModel> {}
