import CreateServiceRequestGateway from '@core/domain/service-request/use-case/gateway/create_service_request.gateway';
import UpdateServiceRequestGateway from '@core/domain/service-request/use-case/gateway/update_service_request.gateway';
import DeleteServiceRequestGateway from '@core/domain/service-request/use-case/gateway/delete_service_request.gateway';
import CreateServiceRequestApplicationGateway from '../gateway/service-request-applications/create_application.gateway';

export default interface ServiceRequestRepository
  extends CreateServiceRequestGateway,
  UpdateServiceRequestGateway,
  DeleteServiceRequestGateway,
  CreateServiceRequestApplicationGateway {}
