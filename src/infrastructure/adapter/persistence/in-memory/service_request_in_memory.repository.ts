import ServiceRequestRepository from '@core/domain/service-request/use-case/repository/service_request.repository';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';

export class ServiceRequestInMemoryRepository implements ServiceRequestRepository {
  private current_available_service_request_id: string;

  constructor(private readonly service_requests: Map<string, ServiceRequestDTO>) {
    this.current_available_service_request_id = '1';
  }

  public async create(service_request: ServiceRequestDTO): Promise<ServiceRequestDTO> {
    const new_service_request: ServiceRequestDTO = {
      service_request_id: this.current_available_service_request_id,
      owner_id: service_request.owner_id,
      title: service_request.title,
      service_brief: service_request.service_brief,
      contact_information: service_request.contact_information,
      category: service_request.category,
      service_provider: null,
      applicants: [],
      phase: ServiceRequestPhase.Open,
      created_at: getCurrentDate()
    };
    this.service_requests.set(this.current_available_service_request_id, new_service_request);
    this.current_available_service_request_id = String(Number(this.current_available_service_request_id) + 1);
    return Promise.resolve(new_service_request);
  }
}
