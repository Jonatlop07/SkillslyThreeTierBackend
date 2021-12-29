import CreateServiceOfferGateway from '@core/domain/service-offer/use-case/gateway/create_service_offer.gateway';
import UpdateServiceOfferGateway from '@core/domain/service-offer/use-case/gateway/update_service_offer.gateway';
import DeleteServiceOfferGateway from '@core/domain/service-offer/use-case/gateway/delete_service_offer.gateway';
import QueryServiceOfferCollectionGateway from '@core/domain/service-offer/use-case/gateway/query_service_offer_collection.gateway';

export default interface ServiceOfferRepository
  extends CreateServiceOfferGateway, UpdateServiceOfferGateway,
    DeleteServiceOfferGateway, QueryServiceOfferCollectionGateway {}
