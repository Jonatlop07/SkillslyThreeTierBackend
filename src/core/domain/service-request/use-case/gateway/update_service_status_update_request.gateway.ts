import ManageStatusRequests from '../persistence/manage_service_request_status_request';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import { ServiceRequestDTO } from '../persistence-dto/service_request.dto';
import FindOne from '@core/common/persistence/find_one';

export default interface UpdateServiceStatusUpdateRequestGateway
  extends ManageStatusRequests, FindOne<ServiceRequestQueryModel, ServiceRequestDTO> {}
