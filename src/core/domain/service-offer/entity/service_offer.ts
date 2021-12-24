import { Entity } from '@core/common/entity/entity';
import { CreateServiceOfferEntityPayload } from '@core/domain/service-offer/entity/type/create_service_offer_entity_payload';

export class ServiceOffer extends Entity<string> {
  private readonly _owner_id: string;
  private readonly _title: string;
  private readonly _service_brief: string;
  private readonly _contact_information: string;
  private readonly _category: string;

  constructor(payload: CreateServiceOfferEntityPayload) {
    super();
    const { owner_id, title, service_brief, contact_information, category } = payload;
    this._owner_id = owner_id;
    this._title = title;
    this._service_brief = service_brief;
    this._contact_information = contact_information;
    this._category = category;
    this._id = payload.id || '';
  }
}
