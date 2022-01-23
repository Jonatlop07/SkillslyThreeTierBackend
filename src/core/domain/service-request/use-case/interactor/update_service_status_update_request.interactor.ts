import { Interactor } from '@core/common/use-case/interactor';
import UpdateServiceStatusUpdateRequestInputModel from '../input-model/update_service_status_update_request_action';
import UpdateServiceStatusUpdateRequestOutputModel from '../output-model/update_service_status_update_request.output_model';

export interface UpdateServiceStatusUpdateRequestInteractor
  extends Interactor<
  UpdateServiceStatusUpdateRequestInputModel,
  UpdateServiceStatusUpdateRequestOutputModel
  > {}
