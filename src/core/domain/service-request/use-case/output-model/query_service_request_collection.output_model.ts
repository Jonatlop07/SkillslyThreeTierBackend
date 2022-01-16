import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';

export default interface QueryServiceRequestCollectionOutputModel {
  service_requests: Array<ServiceRequestDTO>;
}
