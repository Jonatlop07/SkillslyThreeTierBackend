import Create from '@core/common/persistence/create';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import CreateServiceRequestPersistenceDTO
  from '@core/domain/service-request/use-case/persistence-dto/create_service_request.persistence_dto';

export default interface CreateServiceRequestGateway
  extends Create<CreateServiceRequestPersistenceDTO, ServiceRequestDTO> {}
