import UpdateServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/update_service_request.output_model';
import { UpdateServiceRequestResponseDTO } from '@application/api/http-rest/http-dto/service-request/http_update_service_request_response.dto';
import { UpdateServiceRequestDTO } from '@application/api/http-rest/http-dto/service-request/http_update_service_request.dto';
import UpdateServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/update_service_request.input_model';

export class UpdateServiceRequestAdapter {
  public static toInputModel(owner_id: string, service_request_id, payload: UpdateServiceRequestDTO): UpdateServiceRequestInputModel {
    return {
      owner_id,
      service_request_id,
      ...payload
    };
  }

  public static toResponseDTO(payload: UpdateServiceRequestOutputModel): UpdateServiceRequestResponseDTO {
    return payload as UpdateServiceRequestResponseDTO;
  }
}
