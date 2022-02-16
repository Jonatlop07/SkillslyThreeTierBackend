import ServiceOfferRepository from '@core/domain/service-offer/use-case/repository/service_offer.repository';
import { ServiceOfferDTO } from '@core/domain/service-offer/use-case/persistence-dto/service_offer.dto';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import ServiceOfferQueryModel from '@core/domain/service-offer/use-case/query-model/service_offer.query_model';

export class ServiceOfferInMemoryRepository implements ServiceOfferRepository {
  private current_available_service_offer_id: string;

  constructor(private readonly service_offers: Map<string, ServiceOfferDTO>) {
    this.current_available_service_offer_id = '1';
  }

  public create(service_offer: ServiceOfferDTO): Promise<ServiceOfferDTO> {
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

  public exists(params: ServiceOfferQueryModel): Promise<boolean> {
    for (const _service_offer of this.service_offers.values())
      if (_service_offer.service_offer_id === params.service_offer_id)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }

  public update(service_offer: ServiceOfferDTO): Promise<ServiceOfferDTO> {
    const service_offer_to_update: ServiceOfferDTO = {
      service_offer_id: service_offer.service_offer_id,
      title: service_offer.title,
      service_brief: service_offer.service_brief,
      contact_information: service_offer.contact_information,
      category: service_offer.category,
      owner_id: service_offer.owner_id,
      updated_at: getCurrentDate()
    };
    this.service_offers.set(service_offer.service_offer_id, service_offer_to_update);
    return Promise.resolve(service_offer_to_update);
  }

  public async delete(params: ServiceOfferQueryModel): Promise<void> {
    this.service_offers.delete(params.service_offer_id);
    return Promise.resolve();
  }

  public async findAllByCategories(categories: Array<string>): Promise<Array<ServiceOfferDTO>> {
    const service_offers = [];
    for (const _service_offer of this.service_offers.values())
      if (categories.includes(_service_offer.category))
        service_offers.push(_service_offer);
    return Promise.resolve(service_offers);
  }

  public async findAllByUser(user_id: string): Promise<Array<ServiceOfferDTO>> {
    const service_offers = [];
    for (const _service_offer of this.service_offers.values())
      if (_service_offer.owner_id === user_id)
        service_offers.push(_service_offer);
    return Promise.resolve(service_offers);
  }

  public async findAll(params: ServiceOfferQueryModel): Promise<ServiceOfferDTO[]> {
    params;
    const service_offers = [];
    for (const _service_offer of this.service_offers.values())
      service_offers.push(_service_offer);
    return Promise.resolve(service_offers);
  }

  public async findAllByUserAndCategories(params: ServiceOfferQueryModel): Promise<Array<ServiceOfferDTO>> {
    const service_offers = [];
    for (const _service_offer of this.service_offers.values())
      if (params.categories.includes(_service_offer.category)
        || _service_offer.owner_id === params.owner_id)
        service_offers.push(_service_offer);
    return Promise.resolve(service_offers);
  }

  belongsServiceOfferToUser(service_offer_id: string, user_id: string): Promise<boolean> {
    return Promise.resolve(this.service_offers.get(service_offer_id).owner_id === user_id);
  }
}
