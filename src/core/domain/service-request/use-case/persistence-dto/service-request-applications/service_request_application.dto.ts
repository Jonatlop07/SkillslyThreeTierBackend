export interface ServiceRequestApplicationDTO {
  request_id: string;
  applicant_id: string;
  applicant_email?: string;
  message?: string;
  request_phase?: string;
}
