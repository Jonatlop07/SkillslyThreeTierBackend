import { Interactor } from '@core/common/use-case/interactor';
import DeleteServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/delete_service_request.input_model';
import DeleteServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/delete_service_request.output_model';

export interface DeleteServiceRequestInteractor
  extends Interactor<DeleteServiceRequestInputModel, DeleteServiceRequestOutputModel> {}
