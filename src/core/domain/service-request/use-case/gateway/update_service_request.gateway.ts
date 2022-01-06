import Update from '@core/common/persistence/update';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import Find from '@core/common/persistence/find';
import ServiceRequestQueryModel from '@core/domain/service-request/use-case/query-model/service_request.query_model';

export default interface UpdateServiceRequestGateway extends Find<ServiceRequestDTO, ServiceRequestQueryModel>, Update<ServiceRequestDTO> {}
