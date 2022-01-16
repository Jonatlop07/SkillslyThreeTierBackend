import Find from '@core/common/persistence/find';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';

export default interface QueryServiceRequestCollectionGateway extends Find<ServiceRequestDTO, ServiceRequestQueryModel> {
  findAllByCategories(categories: Array<string>, pagination?: PaginationDTO): Promise<Array<ServiceRequestDTO>>;
  findAllByUser(user_id: string, pagination?: PaginationDTO): Promise<Array<ServiceRequestDTO>>;
  findAllByUserAndCategories(params: ServiceRequestQueryModel, pagination?: PaginationDTO): Promise<Array<ServiceRequestDTO>>;
}
