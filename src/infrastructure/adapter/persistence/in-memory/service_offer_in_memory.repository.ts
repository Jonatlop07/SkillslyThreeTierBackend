import ServiceOfferRepository from '@core/domain/service-offer/use-case/repository/service_offer.repository';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import { getCurrentDate } from '@core/common/util/date/moment_utils';

export class ServiceOfferInMemoryRepository implements ServiceOfferRepository {
  private current_available_service_offer_id: string;

  constructor(private readonly service_offers: Map<string, ServiceOfferDTO>) {
    this.current_available_service_offer_id = '1';
  }

  public async create(service_offer: ServiceOfferDTO): Promise<ServiceOfferDTO> {
    const new_service_offer: ServiceOfferDTO = {
      service_offer_id: this.current_available_service_offer_id,
      owner_id: service_offer.owner_id,
      title: service_offer.title,
      service_brief: service_offer.service_brief,
      contact_information: service_offer.contact_information,
      category: service_offer.category,
      created_at: getCurrentDate()
    };
    this.service_offers.set(this.current_available_service_offer_id, new_service_offer);
    this.current_available_service_offer_id = String(Number(this.current_available_service_offer_id) + 1);
    return Promise.resolve(new_service_offer);
  }

  exists(t: ServiceOfferDTO): Promise<boolean> {
    t;
    return Promise.resolve(false);
  }

  public async existsById(id: string): Promise<boolean> {
    for (const _service_offer of this.service_offers.values())
      if (_service_offer.service_offer_id === id)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }

  public async update(service_offer: ServiceOfferDTO): Promise<ServiceOfferDTO> {
    const service_offer_to_update: ServiceOfferDTO = {
      service_offer_id: service_offer.service_offer_id,
      title: service_offer.title,
      service_brief: service_offer.service_brief,
      contact_information: service_offer.contact_information,
      category: service_offer.category,
      owner_id: service_offer.owner_id,
      updated_at: getCurrentDate(),
    };
    this.service_offers.set(service_offer.service_offer_id, service_offer_to_update);
    return Promise.resolve(service_offer_to_update);
  }
}
