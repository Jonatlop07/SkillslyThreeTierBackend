interface ServiceRequestUpdateRequestPayload {
  action: string;
  service_request_id: string;
  service_request_title: string;
  requester_id: string;
  provider_name: string;
  request_date: string
}

export class ServiceRequestStatusUpdateRequestedEvent {
  public readonly action: string;
  public readonly service_request_id: string;
  public readonly service_request_title: string;
  public readonly requester_id: string;
  public readonly provider_name: string;
  public readonly request_date: string;

  constructor(private readonly payload: ServiceRequestUpdateRequestPayload) {
    this.action = payload.action;
    this.service_request_id = payload.service_request_id;
    this.service_request_title = payload.service_request_title;
    this.requester_id = payload.requester_id;
    this.provider_name = payload.provider_name;
    this.request_date = payload.request_date;
  }
}
