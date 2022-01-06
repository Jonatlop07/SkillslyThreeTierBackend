import { ServiceRequest } from '@core/domain/service-request/entity/service_request';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';

export class ServiceRequestMapper {
  public static toServiceRequestDTO(service_request: ServiceRequest) {
    return {
      service_request_id: service_request.id,
      owner_id: service_request.owner_id,
      title: service_request.title,
      service_brief: service_request.service_brief,
      contact_information: service_request.contact_information,
      category: service_request.category,
      service_provider: service_request.service_provider,
      applicants: service_request.applicants,
      phase: service_request.phase
    };
  }

  public static toServiceRequest(service_request_dto: ServiceRequestDTO) {
    return new ServiceRequest({
      id: service_request_dto.service_request_id,
      owner_id: service_request_dto.owner_id,
      title: service_request_dto.title,
      service_brief: service_request_dto.service_brief,
      contact_information: service_request_dto.contact_information,
      category: service_request_dto.category,
      service_provider: service_request_dto.service_provider,
      applicants: service_request_dto.applicants,
      phase: service_request_dto.phase
    });
  }
}
