import QueryServiceRequestCollectionInputModel
  from '@core/domain/service-request/use-case/input-model/query_service_request_collection.input_model';
import { QueryServiceRequestCollectionResponseDTO } from '@application/api/http-rest/http-dto/service-request/http_query_service_request_collection_response.dto';
import { QueryServiceRequestCollectionDTO } from '@application/api/http-rest/http-dto/service-request/http_query_service_request_collection.dto';
import QueryServiceRequestCollectionOutputModel
  from '@core/domain/service-request/use-case/output-model/query_service_request_collection.output_model';

export class QueryServiceRequestCollectionAdapter {
  public static toInputModel(payload: QueryServiceRequestCollectionDTO): QueryServiceRequestCollectionInputModel {
    return {
      owner_id: payload.owner_id,
      categories: payload.categories ? JSON.parse(payload.categories) : undefined,
      pagination: {
        limit: payload.limit ? payload.limit : 10000,
        offset: payload.offset ? payload.offset : 0
      }
    };
  }

  public static toResponseDTO(payload: QueryServiceRequestCollectionOutputModel): QueryServiceRequestCollectionResponseDTO {
    return payload as QueryServiceRequestCollectionResponseDTO;
  }
}
