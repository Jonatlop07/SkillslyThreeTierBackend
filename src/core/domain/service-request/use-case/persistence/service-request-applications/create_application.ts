import { ServiceRequestApplicationDTO } from '../../persistence-dto/service-request-applications/service_request_application.dto';

export default interface CreateServiceRequestApplication{
  createApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO>;
  removeApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO>;
}
