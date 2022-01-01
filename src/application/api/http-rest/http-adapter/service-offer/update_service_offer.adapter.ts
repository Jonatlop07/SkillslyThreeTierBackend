import { UpdateServiceOfferDTO } from '@application/api/http-rest/http-dto/service-offer/http_update_service_offer.dto';
import UpdateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/update_service_offer.input_model';
import UpdateServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/update_service_offer.output_model';
import { UpdateServiceOfferResponseDTO } from '@application/api/http-rest/http-dto/service-offer/http_update_service_offer_response.dto';

export class UpdateServiceOfferAdapter {
  public static toInputModel(
    service_offer_id: string,
    owner_id: string,
    payload: UpdateServiceOfferDTO
  ): UpdateServiceOfferInputModel {
    return {
      service_offer_id,
      owner_id,
      ...payload
    };
  }

  public static toResponseDTO(payload: UpdateServiceOfferOutputModel): UpdateServiceOfferResponseDTO {
    return payload as UpdateServiceOfferResponseDTO;
  }
}
