import Delete from '@core/common/persistence/delete';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import Find from '@core/common/persistence/find';

export default interface DeleteServiceRequestGateway
  extends Find<ServiceRequestDTO, ServiceRequestQueryModel>, Delete<void, ServiceRequestQueryModel> {}
