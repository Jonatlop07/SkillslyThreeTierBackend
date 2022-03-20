import Update from '@core/common/persistence/update';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';
import FindOne from '@core/common/persistence/find/find_one';

export default interface UpdateServiceRequestGateway
  extends FindOne<ServiceRequestQueryModel, ServiceRequestDTO>, Update<ServiceRequestDTO> {}
