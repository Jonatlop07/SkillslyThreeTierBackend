import { Interactor } from '@core/common/use-case/interactor';
import GetServiceRequestApplicationsInputModel from '../../input-model/service-request-applications/get_applications.input_model';
import GetServiceRequestApplicationsOutputModel from '../../output-model/service-request-applications/get_applications.output_model';

export interface GetServiceRequestApplicationsInteractor
  extends Interactor<
  GetServiceRequestApplicationsInputModel,
  GetServiceRequestApplicationsOutputModel
  > {}
