import { ServiceRequestApplicationDTO } from '../../persistence-dto/service-request-applications/service_request_application.dto';

export default interface GetServiceRequestApplications{
  getApplications(request_id: string): Promise<Array<ServiceRequestApplicationDTO>>;
}
