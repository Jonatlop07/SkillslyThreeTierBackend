import Update from '@core/common/persistence/update';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import { ServiceOfferBelongsToUser } from '@core/domain/service-offer/use-case/persistence/service_offer_belongs_to_user';
import ServiceOfferQueryModel from '@core/domain/service-offer/use-case/query-model/service_offer.query_model';
import Exists from '@core/common/persistence/exists';

export default interface UpdateServiceOfferGateway
  extends Exists<ServiceOfferQueryModel>, Update<ServiceOfferDTO>, ServiceOfferBelongsToUser {}
