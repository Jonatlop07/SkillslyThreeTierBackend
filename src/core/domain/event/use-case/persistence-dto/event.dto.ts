export interface EventDTO {
  event_id?: string;
  name: string;
  description?: string;
  lat?: number;
  long?: number;
  date?: Date;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
