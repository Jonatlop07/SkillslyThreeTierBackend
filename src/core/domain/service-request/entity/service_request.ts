import { Entity } from '@core/common/entity/entity';
import { CreateServiceRequestEntityPayload } from '@core/domain/service-request/entity/type/create_service_request_entity_payload';
import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';
import { Nullable } from '@core/common/type/common_types';

export class ServiceRequest extends Entity<string> {
  private readonly _owner_id: string;
  private readonly _title: string;
  private readonly _service_brief: string;
  private readonly _contact_information: string;
  private readonly _category: string;
  private readonly _service_provider: Nullable<string>;
  private readonly _applicants: Array<string>;
  private readonly _phase: ServiceRequestPhase;

  constructor(payload: CreateServiceRequestEntityPayload) {
    super();
    const {
      owner_id, title, service_brief, contact_information,
      category, service_provider, applicants, phase
    } = payload;
    this._owner_id = owner_id;
    this._title = title;
    this._service_brief = service_brief;
    this._contact_information = contact_information;
    this._category = category;
    this._service_provider = service_provider;
    this._applicants = applicants.filter(
      (applicant_id, index, self) =>
        self.indexOf(applicant_id) === index
    );
    this._phase = phase;
    this._id = payload.id || '';
  }
}
