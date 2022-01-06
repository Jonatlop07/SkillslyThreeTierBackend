import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';
import { Nullable } from '@core/common/type/common_types';

export type CreateServiceRequestEntityPayload = {
  id: string;
  owner_id: string;
  title: string;
  service_brief: string;
  contact_information: string;
  category: string;
  service_provider: Nullable<string>;
  applicants: Array<string>;
  phase: ServiceRequestPhase
};
