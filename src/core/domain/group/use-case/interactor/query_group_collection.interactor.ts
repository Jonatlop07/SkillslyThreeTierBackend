import { Interactor } from '@core/common/use-case/interactor';
import QueryGroupCollectionInputModel from '../input-model/query_group_collection.input_model';
import QueryGroupCollectionOutputModel from '../output-model/query_group_collection.output_model';

export interface QueryGroupCollectionInteractor
  extends Interactor<
  QueryGroupCollectionInputModel,
  QueryGroupCollectionOutputModel
  > { }
