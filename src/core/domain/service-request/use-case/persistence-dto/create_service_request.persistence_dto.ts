import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';
import { Id } from '@core/common/type/common_types';

export default interface CreateServiceRequestPersistenceDTO {
  owner_id: Id,
  title: string,
  service_brief: string,
  contact_information: string,
  category: string,
  phase: ServiceRequestPhase
}
