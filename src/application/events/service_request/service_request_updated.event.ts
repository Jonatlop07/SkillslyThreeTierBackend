interface ServiceRequestUpdatedPayload {
  applicants: Array<string>;
  service_request_id: string;
  service_request_title: string;
}

export class ServiceRequestUpdatedEvent {
  public readonly applicants: Array<string>;
  public readonly service_request_id: string;
  public readonly service_request_title: string;

  constructor(private readonly payload: ServiceRequestUpdatedPayload) {
    this.applicants = payload.applicants;
    this.service_request_id = payload.service_request_id;
    this.service_request_title = payload.service_request_title;
  }
}
