import { CreateServiceRequestResponseDTO } from '@application/api/http-rest/http-dto/service-request/http_create_service_request_response.dto';
import CreateServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/create_service_request.output_model';
import { CreateServiceRequestDTO } from '@application/api/http-rest/http-dto/service-request/http_create_service_request.dto';
import CreateServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/create_service_request.input_model';

export class CreateServiceRequestAdapter {
  public static toInputModel(requester_id: string, payload: CreateServiceRequestDTO): CreateServiceRequestInputModel {
    return {
      requester_id,
      ...payload
    };
  }

  public static toResponseDTO(payload: CreateServiceRequestOutputModel): CreateServiceRequestResponseDTO {
    return payload as CreateServiceRequestResponseDTO;
  }
}
