import { ServiceRequestApplicationDTO } from '../../persistence-dto/service-request-applications/service_request_application.dto';

export default interface GetServiceRequestEvaluationApplicant{
  getEvaluationApplicant(request_id: string): Promise<ServiceRequestApplicationDTO>;
}
