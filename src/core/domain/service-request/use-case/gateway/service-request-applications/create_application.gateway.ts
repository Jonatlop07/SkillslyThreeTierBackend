import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import Find from '@core/common/persistence/find';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import CreateServiceRequestApplication from '../../persistence/service-request-applications/create_application';
import UpdateServiceRequestApplicationGateway from './update_application.gateway';
import ExistsApplicationOrRequests from '../../persistence/service-request-applications/exists_application_or_requests';

export default interface CreateServiceRequestApplicationGateway
  extends Find<ServiceRequestDTO, ServiceRequestQueryModel>,
  CreateServiceRequestApplication,
  UpdateServiceRequestApplicationGateway,
  ExistsApplicationOrRequests {}