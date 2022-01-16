export default interface CreateServiceStatusUpdateRequestOutputModel {
  provider_id: string;
  service_request_id: string;
  requester_id: string;
  request_date?: string;
  action: string;
}
