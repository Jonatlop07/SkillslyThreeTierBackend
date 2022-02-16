import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import { PaginationDTO } from '@core/common/persistence/pagination.dto';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import FindAll from '@core/common/persistence/find/find_all';

export default interface QueryServiceRequestCollectionGateway extends FindAll<ServiceRequestQueryModel, ServiceRequestDTO> {
  findAllByCategories(categories: Array<string>, pagination?: PaginationDTO): Promise<Array<ServiceRequestDTO>>;
  findAllByUser(user_id: string, pagination?: PaginationDTO): Promise<Array<ServiceRequestDTO>>;
  findAllByUserAndCategories(params: ServiceRequestQueryModel, pagination?: PaginationDTO): Promise<Array<ServiceRequestDTO>>;
}
