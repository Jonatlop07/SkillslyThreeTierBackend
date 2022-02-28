import Create from '@core/common/persistence/create/create';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import CreateServiceOfferPersistenceDTO
  from '@core/domain/service-offer/use-case/persistence-dto/create_service_offer.persistence_dto';

export default interface CreateServiceOfferGateway
  extends Create<CreateServiceOfferPersistenceDTO, ServiceOfferDTO> {}
