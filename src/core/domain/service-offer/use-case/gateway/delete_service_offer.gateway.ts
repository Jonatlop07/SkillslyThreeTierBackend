import Delete from '@core/common/persistence/delete';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import ServiceOfferQueryModel from '@core/domain/service-offer/use-case/query-model/service_offer.query_model';
import Exists from '@core/common/persistence/exists';

export default interface DeleteServiceOfferGateway
  extends Exists<ServiceOfferDTO>, Delete<void, ServiceOfferQueryModel> {}
