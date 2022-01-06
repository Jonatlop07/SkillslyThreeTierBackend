interface ServiceRequestDeletedPayload {
  applicants: Array<string>;
  service_request_title: string;
}

export class ServiceRequestDeletedEvent {
  public readonly applicants: Array<string>;
  public readonly service_request_title: string;

  constructor(private readonly payload: ServiceRequestDeletedPayload) {
    this.applicants = payload.applicants;
    this.service_request_title = payload.service_request_title;
  }
}
