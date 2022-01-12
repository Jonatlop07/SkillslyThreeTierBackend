import { ServiceRequestApplicationDTO } from '../../persistence-dto/service-request-applications/service_request_application.dto';

export default interface UpdateServiceRequestApplication{
  acceptApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO>;
  confirmApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO>;
  denyApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO>;
}
