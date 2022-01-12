import { Interactor } from '@core/common/use-case/interactor';
import CreateServiceRequestApplicationInputModel from '../../input-model/service-request-applications/create_application.input_model';
import CreateServiceRequestApplicationOutputModel from '../../output-model/service-request-applications/create_application.output_model';

export interface CreateServiceRequestApplicationInteractor
  extends Interactor<
  CreateServiceRequestApplicationInputModel,
  CreateServiceRequestApplicationOutputModel
  > {}
