import Exists from '@core/common/persistence/exists';
import Update from '@core/common/persistence/update';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import { ServiceOfferBelongsToUser } from '@core/domain/service-offer/use-case/persistence/service_offer_belongs_to_user';

export default interface UpdateServiceOfferGateway
  extends Exists<ServiceOfferDTO>, Update<ServiceOfferDTO>, ServiceOfferBelongsToUser {}
