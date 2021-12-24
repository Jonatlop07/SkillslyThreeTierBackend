import CreateServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/create_service_offer.output_model';
import { CreateServiceOfferResponseDTO } from '@application/api/http-rest/http-dto/service-offer/http_create_service_offfer_response.dto';
import CreateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/create_service_offer.input_model';
import { CreateServiceOfferDTO } from '@application/api/http-rest/http-dto/service-offer/http_create_service_offer.dto';

export class CreateServiceOfferAdapter {
  public static toInputModel(user_id: string, payload: CreateServiceOfferDTO): CreateServiceOfferInputModel {
    return {
      user_id,
      ...payload
    };
  }

  public static toResponseDTO(payload: CreateServiceOfferOutputModel): CreateServiceOfferResponseDTO {
    return payload as CreateServiceOfferResponseDTO;
  }
}
