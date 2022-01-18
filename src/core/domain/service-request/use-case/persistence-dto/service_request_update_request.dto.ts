export interface UpdateRequestDTO {
  provider_id: string;
  service_request_id: string;
  service_request_title?: string;
  request_date?: string;
  requester_id?: string;
  requester_name?: string;
}
