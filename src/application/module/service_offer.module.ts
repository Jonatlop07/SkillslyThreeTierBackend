import { Module, Provider } from '@nestjs/common';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import { ServiceOfferNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/service-offer/neo4j_service_offer_repository.adapter';
import { CreateServiceOfferService } from '@core/service/service-offer/create_service_offer.service';
import { ServiceOfferController } from '@application/api/http-rest/controller/service_offer.controller';
import { UpdateServiceOfferService } from '@core/service/service-offer/update_service_offer.service';
import { DeleteServiceOfferService } from '@core/service/service-offer/delete_service_offer.service';
import { QueryServiceOfferCollectionService } from '@core/service/service-offer/query_service_offer_collection.service';

const persistence_providers: Array<Provider> = [
  {
    provide: ServiceOfferDITokens.ServiceOfferRepository,
    useClass: ServiceOfferNeo4jRepositoryAdapter
  }
];

const use_case_providers: Array<Provider> = [
  {
    provide: ServiceOfferDITokens.CreateServiceOfferInteractor,
    useFactory: (gateway) => new CreateServiceOfferService(gateway),
    inject: [ServiceOfferDITokens.ServiceOfferRepository]
  },
  {
    provide: ServiceOfferDITokens.UpdateServiceOfferInteractor,
    useFactory: (gateway) => new UpdateServiceOfferService(gateway),
    inject: [ServiceOfferDITokens.ServiceOfferRepository]
  },
  {
    provide: ServiceOfferDITokens.DeleteServiceOfferInteractor,
    useFactory: (gateway) => new DeleteServiceOfferService(gateway),
    inject: [ServiceOfferDITokens.ServiceOfferRepository]
  },
  {
    provide: ServiceOfferDITokens.QueryServiceOfferCollectionInteractor,
    useFactory: (gateway) => new QueryServiceOfferCollectionService(gateway),
    inject: [ServiceOfferDITokens.ServiceOfferRepository]
  }
];

@Module({
  imports: [],
  controllers: [ServiceOfferController],
  providers: [...persistence_providers, ...use_case_providers],
  exports: []
})
export class ServiceOfferModule {}
