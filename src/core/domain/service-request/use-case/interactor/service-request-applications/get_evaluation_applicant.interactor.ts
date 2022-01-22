import { Interactor } from '@core/common/use-case/interactor';
import GetServiceRequestEvaluationApplicantInputModel from '../../input-model/service-request-applications/get_evaluation_applicant.input_model';
import GetServiceRequestEvaluationApplicantOutputModel from '../../output-model/service-request-applications/get_evaluation_applicant.output_model';

export interface GetServiceRequestEvaluationApplicantInteractor
  extends Interactor<
  GetServiceRequestEvaluationApplicantInputModel,
  GetServiceRequestEvaluationApplicantOutputModel
  > {}
