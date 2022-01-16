import { Interactor } from '@core/common/use-case/interactor';
import QueryServiceRequestCollectionInputModel
  from '@core/domain/service-request/use-case/input-model/query_service_request_collection.input_model';
import QueryServiceRequestCollectionOutputModel
  from '@core/domain/service-request/use-case/output-model/query_service_request_collection.output_model';

export interface QueryServiceRequestCollectionInteractor
  extends Interactor<QueryServiceRequestCollectionInputModel, QueryServiceRequestCollectionOutputModel> {}
