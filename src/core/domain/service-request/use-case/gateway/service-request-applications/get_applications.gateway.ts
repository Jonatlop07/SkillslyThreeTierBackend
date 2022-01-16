import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import Find from '@core/common/persistence/find';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import GetServiceRequestApplications from '../../persistence/service-request-applications/get_applications';

export default interface GetServiceRequestApplicationsGateway
  extends Find<ServiceRequestDTO, ServiceRequestQueryModel>, GetServiceRequestApplications{}