import { Module, Provider } from '@nestjs/common';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestService } from '@core/service/service_request/create_service_request.service';
import { ServiceRequestNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/service-request/neo4j_service_request_repository.adapter';
import { ServiceRequestController } from '@application/api/http-rest/controller/service_request.controller';

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
  }
];

@Module({
  imports: [],
  controllers: [ServiceRequestController],
  providers: [...persistence_providers, ...use_case_providers],
  exports: []
})
export class ServiceRequestModule {}
