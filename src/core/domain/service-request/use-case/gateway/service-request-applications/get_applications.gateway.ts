import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import GetServiceRequestApplications from '../../persistence/service-request-applications/get_applications';
import FindOne from '@core/common/persistence/find_one';

export default interface GetServiceRequestApplicationsGateway
  extends FindOne<ServiceRequestQueryModel, ServiceRequestDTO>, GetServiceRequestApplications{}
