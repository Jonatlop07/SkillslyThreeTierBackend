interface ServiceRequestUpdateRequestPayload {
  action: string;
  service_request_id: string;
  requester_id: string;
  request_date: string
}

export class ServiceRequestStatusUpdateRequestedEvent {
  public readonly action: string;
  public readonly service_request_id: string;
  public readonly requester_id: string;
  public readonly request_date: string;

  constructor(private readonly payload: ServiceRequestUpdateRequestPayload) {
    this.action = payload.action;
    this.service_request_id = payload.service_request_id;
    this.requester_id = payload.requester_id;
    this.request_date = payload.request_date;
  }
}
