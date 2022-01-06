import { Interactor } from '@core/common/use-case/interactor';
import CreateServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/create_service_request.input_model';
import CreateServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/create_service_request.output_model';

export interface CreateServiceRequestInteractor extends Interactor<CreateServiceRequestInputModel, CreateServiceRequestOutputModel> {}
