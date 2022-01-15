import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import Find from '@core/common/persistence/find';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import UpdateServiceRequestApplication from '../../persistence/service-request-applications/update_application';
import ExistsApplicationOrRequests from '../../persistence/service-request-applications/exists_application_or_requests';

export default interface UpdateServiceRequestApplicationGateway
  extends Find<ServiceRequestDTO, ServiceRequestQueryModel>, UpdateServiceRequestApplication, ExistsApplicationOrRequests {}