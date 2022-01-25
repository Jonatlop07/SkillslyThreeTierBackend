export default interface UpdateServiceStatusUpdateRequestOutputModel {
  provider_id: string;
  service_request_id: string;
  service_request_title: string;
  requester_id: string;
  requester_name: string;
  request_date?: string;
  action: string;
}