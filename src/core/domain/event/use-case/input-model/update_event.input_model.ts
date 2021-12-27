import { EventContentElement } from "../../entity/type/event_content_element";

export default interface UpdateEventInputModel {
  id: string;
  name: string; 
  description: string; 
  lat: number; 
  long: number;
  date: Date;  
  user_id: string;
}