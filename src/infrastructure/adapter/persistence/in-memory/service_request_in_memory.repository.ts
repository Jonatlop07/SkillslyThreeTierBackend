import ServiceRequestRepository from '@core/domain/service-request/use-case/repository/service_request.repository';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import { Optional } from '@core/common/type/common_types';
import { ServiceRequestApplicationDTO } from '@core/domain/service-request/use-case/persistence-dto/service-request-applications/service_request_application.dto';
import { UpdateRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request_update_request.dto';

export class ServiceRequestInMemoryRepository implements ServiceRequestRepository {
  private current_available_service_request_id: string;
  private current_available_service_request_evaluation_applicant: string;
  private current_service_request_completion_request: string;
  private current_service_request_cancel_request: string;
  private current_service_request_closed: string;

  constructor(private readonly service_requests: Map<string, ServiceRequestDTO>) {
    this.current_available_service_request_id = '1';
    this.current_available_service_request_evaluation_applicant = '';
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

  public exists(params: ServiceRequestQueryModel): Promise<boolean> {
    for (const _service_request of this.service_requests.values())
      if (_service_request.service_request_id === params.service_request_id)
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

  public async createApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id } = params;
    this.service_requests.get(request_id).applicants.push(applicant_id);
    return Promise.resolve({
      request_id: params.request_id,
      applicant_id: params.applicant_id,
    });
  }

  public async removeApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id } = params;
    const applicants = this.service_requests.get(request_id).applicants;
    const existing_application = applicants.indexOf(applicant_id);
    this.service_requests.get(request_id).applicants.splice(existing_application, 1);
    return Promise.resolve({
      request_id,
      applicant_id
    });
  }


  public async acceptApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id } = params;
    this.current_available_service_request_evaluation_applicant = applicant_id;
    this.service_requests.set(request_id, { ...this.service_requests.get(request_id), phase: ServiceRequestPhase.Evaluation });
    return Promise.resolve({
      request_id: request_id,
      applicant_id: this.current_available_service_request_evaluation_applicant,
      request_phase: this.service_requests.get(request_id).phase
    });
  }

  public async confirmApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id } = params;
    this.current_available_service_request_evaluation_applicant = '';
    this.service_requests.set(request_id, { ...this.service_requests.get(request_id), phase: ServiceRequestPhase.Execution, service_provider: applicant_id });
    return Promise.resolve({
      request_id: request_id,
      applicant_id: this.service_requests.get(request_id).service_provider,
      request_phase: this.service_requests.get(request_id).phase
    });
  }

  public async denyApplication(params: ServiceRequestApplicationDTO): Promise<ServiceRequestApplicationDTO> {
    const { request_id, applicant_id } = params;
    this.current_available_service_request_evaluation_applicant = '';
    this.service_requests.set(request_id, { ...this.service_requests.get(request_id), phase: ServiceRequestPhase.Open });
    return Promise.resolve({
      request_id: request_id,
      applicant_id: applicant_id,
      request_phase: this.service_requests.get(request_id).phase
    });
  }

  public async existsApplication(params: ServiceRequestQueryModel): Promise<boolean> {
    for (const application of this.service_requests.get(params.service_request_id).applicants){
      if (application === params.owner_id)
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  public async getApplications(request_id: string): Promise<ServiceRequestApplicationDTO[]> {
    return Promise.resolve(this.service_requests.get(request_id).applicants.map((applicant)=> {
      return {
        applicant_id: applicant,
        request_id: request_id,
      };
    }));
  }

  public async existsRequest(params: UpdateRequestDTO): Promise<boolean> {
    if ( this.current_service_request_cancel_request
      || this.current_service_request_completion_request ){
      return Promise.resolve(true);
    }
    params;
    return Promise.resolve(false);
  }

  public async createCompleteRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO> {
    const {service_request_id, provider_id } = params;
    this.current_service_request_completion_request = provider_id.concat(service_request_id);
    return Promise.resolve({
      service_request_id,
      provider_id
    });
  }
  public async createCancelRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO> {
    const {service_request_id, provider_id } = params;
    this.current_service_request_cancel_request = provider_id.concat(service_request_id);
    return Promise.resolve({
      service_request_id,
      provider_id
    });
  }

  public async completeRequest(params: UpdateRequestDTO, requestedUpdateStatusIsCompletion: boolean): Promise<UpdateRequestDTO> {
    const {service_request_id, provider_id } = params;
    if (this.current_service_request_cancel_request) {
      this.current_service_request_closed = this.current_service_request_cancel_request;
    } else if (this.current_service_request_completion_request) {
      this.current_service_request_closed = this.current_service_request_completion_request;
    }
    return Promise.resolve({
      service_request_id,
      provider_id
    });
  }

  public async cancelRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO> {
    const {service_request_id, provider_id } = params;
    if (this.current_service_request_cancel_request) {
      this.current_service_request_cancel_request = '';
    } else if (this.current_service_request_completion_request) {
      this.current_service_request_completion_request = '';
    }
    return Promise.resolve({
      service_request_id,
      provider_id
    });
  }

  public async findAllByCategories(categories: Array<string>): Promise<Array<ServiceRequestDTO>> {
    const service_requests = [];
    for (const _service_request of this.service_requests.values())
      if (categories.includes(_service_request.category))
        service_requests.push(_service_request);
    return Promise.resolve(service_requests);
  }

  public async findAllByUser(user_id: string): Promise<Array<ServiceRequestDTO>> {
    const service_requests = [];
    for (const _service_request of this.service_requests.values())
      if (_service_request.owner_id === user_id)
        service_requests.push(_service_request);
    return Promise.resolve(service_requests);
  }

  public async findAll(params: ServiceRequestQueryModel): Promise<ServiceRequestDTO[]> {
    params;
    const service_requests = [];
    for (const _service_request of this.service_requests.values())
      service_requests.push(_service_request);
    return Promise.resolve(service_requests);
  }

  public async findAllByUserAndCategories(params: ServiceRequestQueryModel): Promise<Array<ServiceRequestDTO>> {
    const service_requests = [];
    for (const _service_request of this.service_requests.values())
      if (params.categories.includes(_service_request.category)
        || _service_request.owner_id === params.owner_id)
        service_requests.push(_service_request);
    return Promise.resolve(service_requests);
  }

  public async getEvaluationApplicant(request_id: string): Promise<ServiceRequestApplicationDTO> {
    return Promise.resolve({
      request_id,
      applicant_id: this.current_available_service_request_evaluation_applicant
    });
  }
}
