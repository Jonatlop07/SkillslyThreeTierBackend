import Create from '@core/common/persistence/create';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';

export default interface CreateServiceOfferGateway extends Create<ServiceOfferDTO> {}
