import { Interactor } from '@core/common/use-case/interactor';
import UpdateServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/update_service_request.input_model';
import UpdateServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/update_service_request.output_model';

export interface UpdateServiceRequestInteractor extends Interactor<UpdateServiceRequestInputModel, UpdateServiceRequestOutputModel> {}
