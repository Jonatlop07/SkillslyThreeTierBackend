import { Module, Provider } from '@nestjs/common';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestService } from '@core/service/service_request/create_service_request.service';
import { ServiceRequestNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/service-request/neo4j_service_request_repository.adapter';
import { ServiceRequestController } from '@application/api/http-rest/controller/service_request.controller';
import { UpdateServiceRequestService } from '@core/service/service_request/update_service_request.service';
import { DeleteServiceRequestService } from '@core/service/service_request/delete_service_request.service';
import { CreateServiceRequestApplicationService } from '@core/service/service_request/service-request-applications/create_application.service';
import { UpdateServiceRequestApplicationService } from '@core/service/service_request/service-request-applications/update_application.service';
import { GetServiceRequestApplicationsService } from '@core/service/service_request/service-request-applications/get_applications.service';
import { CreateServiceStatusUpdateRequestService } from '@core/service/service_request/request_cancel_or_completion.service';
import { QueryServiceRequestCollectionService } from '@core/service/service_request/query_service_request_collection.service';
import { UpdateServiceStatusUpdateRequestService } from '@core/service/service_request/update_service_status_update_request.service';

const persistence_providers: Array<Provider> = [
  {
    provide: ServiceRequestDITokens.ServiceRequestRepository,
    useClass: ServiceRequestNeo4jRepositoryAdapter
  }
];

const use_case_providers: Array<Provider> = [
  {
    provide: ServiceRequestDITokens.CreateServiceRequestInteractor,
    useFactory: (gateway) => new CreateServiceRequestService(gateway),
    inject: [ServiceRequestDITokens.ServiceRequestRepository]
  },
  {
    provide: ServiceRequestDITokens.UpdateServiceRequestInteractor,
    useFactory: (gateway) => new UpdateServiceRequestService(gateway),
    inject: [ServiceRequestDITokens.ServiceRequestRepository]
  },
  {
    provide: ServiceRequestDITokens.DeleteServiceRequestInteractor,
    useFactory: (gateway) => new DeleteServiceRequestService(gateway),
    inject: [ServiceRequestDITokens.ServiceRequestRepository]
  },
  {
    provide: ServiceRequestDITokens.CreateServiceRequestApplicationInteractor,
    useFactory: (gateway) =>  new CreateServiceRequestApplicationService(gateway),
    inject: [ServiceRequestDITokens.ServiceRequestRepository]
  },
  {
    provide: ServiceRequestDITokens.UpdateServiceRequestApplicationInteractor,
    useFactory: (gateway) =>  new UpdateServiceRequestApplicationService(gateway),
    inject: [ServiceRequestDITokens.ServiceRequestRepository]
  },
  {
    provide: ServiceRequestDITokens.GetServiceRequestApplicationsInteractor,
    useFactory: (gateway) =>  new GetServiceRequestApplicationsService(gateway),
    inject: [ServiceRequestDITokens.ServiceRequestRepository]
  },
  {
    provide: ServiceRequestDITokens.CreateServiceStatusUpdateRequestInteractor,
    useFactory: (gateway) =>  new CreateServiceStatusUpdateRequestService(gateway),
    inject: [ServiceRequestDITokens.ServiceRequestRepository]
  },
  {
    provide: ServiceRequestDITokens.UpdateServiceStatusUpdateRequestInteractor,
    useFactory: (gateway) =>  new UpdateServiceStatusUpdateRequestService(gateway),
    inject: [ServiceRequestDITokens.ServiceRequestRepository]
  },
  {
    provide: ServiceRequestDITokens.QueryServiceRequestCollectionInteractor,
    useFactory: (gateway) =>  new QueryServiceRequestCollectionService(gateway),
    inject: [ServiceRequestDITokens.ServiceRequestRepository]
  }
];

@Module({
  imports: [],
  controllers: [ServiceRequestController],
  providers: [...persistence_providers, ...use_case_providers],
  exports: []
})
export class ServiceRequestModule {}
