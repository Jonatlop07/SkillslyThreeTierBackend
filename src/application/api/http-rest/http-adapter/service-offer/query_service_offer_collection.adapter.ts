import QueryServiceOfferCollectionInputModel
  from '@core/domain/service-offer/use-case/input-model/query_service_offer_collection.input_model';
import { QueryServiceOfferCollectionResponseDTO } from '@application/api/http-rest/http-dto/service-offer/http_query_service_offer_collection_response.dto';
import { QueryServiceOfferCollectionDTO } from '@application/api/http-rest/http-dto/service-offer/http_query_service_offer_collection.dto';
import QueryServiceOfferCollectionOutputModel
  from '@core/domain/service-offer/use-case/output-model/query_service_offer_collection.output_model';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';

export class QueryServiceOfferCollectionAdapter {
  public static toInputModel(payload: QueryServiceOfferCollectionDTO): QueryServiceOfferCollectionInputModel {
    return {
      owner_id: payload.owner_id,
      categories: payload.categories,
      pagination: payload.pagination as PaginationDTO
    };
  }

  public static toResponseDTO(payload: QueryServiceOfferCollectionOutputModel): QueryServiceOfferCollectionResponseDTO {
    return payload as QueryServiceOfferCollectionResponseDTO;
  }
}
