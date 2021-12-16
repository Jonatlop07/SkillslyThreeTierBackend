import { PaginationDTO } from "@application/api/http-rest/http-dtos/http_pagination.dto";
import { EventDTO } from "../persistence-dto/event.dto";

export default interface GetEvent {
  getEventsOfFriends(id: string, pagination: PaginationDTO): Promise<Array<EventDTO>>;
  getMyEvents(id: string, pagination:PaginationDTO): Promise<Array<EventDTO>>;
}