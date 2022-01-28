import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';
import { Nullable } from '@core/common/type/common_types';

export interface ServiceRequestDTO {
  service_request_id?: string;
  owner_id: string;
  title: string;
  service_brief: string;
  contact_information: string;
  category: string;
  service_provider: Nullable<string>;
  applicants: Array<string>;
  phase: ServiceRequestPhase;
  created_at?: string;
  updated_at?: string
  provider_requested_status_update?: boolean;
  requested_status_update?: string;
}
