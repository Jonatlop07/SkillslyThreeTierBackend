import CreateServiceRequestGateway from '@core/domain/service-request/use-case/gateway/create_service_request.gateway';
import UpdateServiceRequestGateway from '@core/domain/service-request/use-case/gateway/update_service_request.gateway';
import DeleteServiceRequestGateway from '@core/domain/service-request/use-case/gateway/delete_service_request.gateway';
import CreateServiceRequestApplicationGateway from '../gateway/service-request-applications/create_application.gateway';
import UpdateServiceRequestApplicationGateway from '../gateway/service-request-applications/update_application.gateway';
import GetServiceRequestApplicationsGateway from '../gateway/service-request-applications/get_applications.gateway';
import CreateServiceStatusUpdateRequestGateway from '../gateway/request_cancel_or_completion.gateway';

export default interface ServiceRequestRepository
  extends CreateServiceRequestGateway,
  UpdateServiceRequestGateway,
  DeleteServiceRequestGateway,
  CreateServiceRequestApplicationGateway,
  UpdateServiceRequestApplicationGateway,
  GetServiceRequestApplicationsGateway,
  CreateServiceStatusUpdateRequestGateway {}
