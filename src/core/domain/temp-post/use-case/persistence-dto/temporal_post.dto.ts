export interface TemporalPostDTO {
  temporal_post_id?: string;
  description?: string;
  reference: string;
  referenceType: string;
  user_id: string;
  created_at?: string;
  expires_at?: string;
}