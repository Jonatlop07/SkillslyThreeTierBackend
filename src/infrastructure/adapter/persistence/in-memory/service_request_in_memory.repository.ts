import ServiceRequestRepository from '@core/domain/service-request/use-case/repository/service_request.repository';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import { Optional } from '@core/common/type/common_types';

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

  exists(t: ServiceRequestDTO): Promise<boolean> {
    t;
    return Promise.resolve(false);
  }

  public async existsById(id: string): Promise<boolean> {
    for (const _service_request of this.service_requests.values())
      if (_service_request.service_request_id === id)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }

  public async update(service_request: ServiceRequestDTO): Promise<ServiceRequestDTO> {
    const service_request_to_update: ServiceRequestDTO = {
      service_request_id: service_request.service_request_id,
      title: service_request.title,
      service_brief: service_request.service_brief,
      contact_information: service_request.contact_information,
      category: service_request.category,
      owner_id: service_request.owner_id,
      applicants: service_request.applicants,
      phase: service_request.phase,
      service_provider: service_request.service_provider,
      updated_at: getCurrentDate()
    };
    this.service_requests.set(service_request.service_request_id, service_request_to_update);
    return Promise.resolve(service_request_to_update);
  }

  public async delete(params: ServiceRequestQueryModel): Promise<void> {
    this.service_requests.delete(params.service_request_id);
    return Promise.resolve();
  }

  public async findOne(params: ServiceRequestQueryModel): Promise<Optional<ServiceRequestDTO>> {
    for (const _service_request of this.service_requests.values())
      if (_service_request.service_request_id === params.service_request_id)
        return Promise.resolve(_service_request);
    return Promise.resolve(null);
  }

  deleteById(id: string): Promise<void> {
    id;
    throw new Error('Method not implemented');
  }

  findAll(params: ServiceRequestQueryModel): Promise<ServiceRequestDTO[]> {
    params;
    return Promise.resolve([]);
  }

  findAllWithRelation(params: ServiceRequestQueryModel): Promise<any> {
    params;
    return Promise.resolve(undefined);
  }
}
