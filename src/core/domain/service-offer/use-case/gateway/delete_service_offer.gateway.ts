import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import ServiceOfferQueryModel from '@core/domain/service-offer/use-case/query-model/service_offer.query_model';
import { ServiceOfferBelongsToUser } from '@core/domain/service-offer/use-case/persistence/service_offer_belongs_to_user';
import Exists from '@core/common/persistence/exists/exists';
import Delete from '@core/common/persistence/delete/delete';

export default interface DeleteServiceOfferGateway
  extends Exists<ServiceOfferQueryModel>, Delete<ServiceOfferQueryModel, ServiceOfferDTO>, ServiceOfferBelongsToUser {}
