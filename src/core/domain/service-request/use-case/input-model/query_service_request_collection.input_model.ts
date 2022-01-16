import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';

export default interface QueryServiceRequestCollectionInputModel extends ServiceRequestQueryModel {
  pagination?: PaginationDTO;
}
