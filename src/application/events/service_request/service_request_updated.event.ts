interface ServiceRequestUpdatedPayload {
  applicants: Array<string>;
  service_request_id: string;
}

export class ServiceRequestUpdatedEvent {
  public readonly applicants: Array<string>;
  public readonly service_request_id: string;

  constructor(private readonly payload: ServiceRequestUpdatedPayload) {
    this.applicants = payload.applicants;
    this.service_request_id = payload.service_request_id;
  }
}
