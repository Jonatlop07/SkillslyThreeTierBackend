import { Interactor } from '@core/common/use-case/interactor';
import UpdateServiceRequestApplicationInputModel from '../../input-model/service-request-applications/update_application.input_model';
import UpdateServiceRequestApplicationOutputModel from '../../output-model/service-request-applications/update_application.output_model';

export interface UpdateServiceRequestApplicationInteractor
  extends Interactor<
  UpdateServiceRequestApplicationInputModel,
  UpdateServiceRequestApplicationOutputModel
  > {}
