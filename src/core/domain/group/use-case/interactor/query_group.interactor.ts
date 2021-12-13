import { Interactor } from '@core/common/use-case/interactor';
import QueryGroupInputModel from '../input-model/query_group.input_model';
import QueryGroupOutputModel from '../output-model/query_group.output_model';

export interface QueryGroupInteractor
  extends Interactor<
  QueryGroupInputModel,
  QueryGroupOutputModel
  > { }
