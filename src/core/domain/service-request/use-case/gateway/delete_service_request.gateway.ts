import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import FindOne from '@core/common/persistence/find/find_one';
import Delete from '@core/common/persistence/delete/delete';

export default interface DeleteServiceRequestGateway
  extends FindOne<ServiceRequestQueryModel, ServiceRequestDTO>, Delete<ServiceRequestQueryModel, ServiceRequestDTO> {}
