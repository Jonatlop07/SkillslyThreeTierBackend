import { Interactor } from '@core/common/use-case/interactor';
import CreateServiceStatusUpdateRequestInputModel from '../input-model/request_cancel_or_completion.input_model';
import CreateServiceStatusUpdateRequestOutputModel from '../output-model/request_cancel_or_completion.output_model';

export interface CreateServiceStatusUpdateRequestInteractor
  extends Interactor<
  CreateServiceStatusUpdateRequestInputModel,
  CreateServiceStatusUpdateRequestOutputModel
  > {}
