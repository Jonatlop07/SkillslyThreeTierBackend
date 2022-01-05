import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';

export default interface QueryServiceOfferCollectionOutputModel {
  service_offers: Array<ServiceOfferDTO>;
}
