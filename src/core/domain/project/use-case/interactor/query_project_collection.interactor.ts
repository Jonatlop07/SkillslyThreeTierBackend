import { Interactor } from '@core/common/use-case/interactor';
import QueryProjectCollectionInputModel
  from '@core/domain/project/use-case/input-model/query_project_collection.input_model';
import QueryProjectCollectionOutputModel
  from '@core/domain/project/use-case/output-model/query_project_collection.output_model';

export interface QueryProjectCollectionInteractor
  extends Interactor<QueryProjectCollectionInputModel, QueryProjectCollectionOutputModel> {
}
