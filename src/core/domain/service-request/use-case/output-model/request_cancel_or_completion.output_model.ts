export default interface CreateServiceStatusUpdateRequestOutputModel {
  provider_id: string;
  service_request_id: string;
  service_request_title: string;
  requester_id: string;
  provider_name: string;
  request_date?: string;
  action: string;
}
