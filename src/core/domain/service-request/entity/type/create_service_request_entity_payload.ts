import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';
import { Id, Nullable } from '@core/common/type/common_types';

export type CreateServiceRequestEntityPayload = {
  id: Id;
  owner_id: Id;
  title: string;
  service_brief: string;
  contact_information: string;
  category: string;
  service_provider: Nullable<Id>;
  applicants: Array<Id>;
  phase: ServiceRequestPhase
};
