import Create from '@core/common/persistence/create';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';

export default interface CreateServiceRequestGateway extends Create<ServiceRequestDTO> {}
