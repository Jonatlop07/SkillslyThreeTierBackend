import { PaginationDTO } from '@application/api/http-rest/http-dto/http_pagination.dto';
import { EventDTO } from '@core/domain/event/use-case/persistence-dto/event.dto';
import EventRepository from '@core/domain/event/use-case/repository/event.repository';

export class EventInMemoryRepository implements EventRepository {
  private currently_available_event_id: string;

  constructor(private readonly events: Map<string, EventDTO>) {
    this.currently_available_event_id = '1';
  }

  async create(event: EventDTO): Promise<EventDTO> {
    const new_event: EventDTO = {
      event_id: this.currently_available_event_id,
      name: event.name,
      date: event.date,
      user_id: event.user_id,
      lat: event.lat,
      long: event.long
    };
    this.events.set(this.currently_available_event_id, new_event);
    this.currently_available_event_id = String(Number(this.currently_available_event_id) + 1);
    return Promise.resolve(new_event);
  }

  public getEventsOfFriends(id: string, pagination: PaginationDTO): Promise<EventDTO[]> {
    const user_events: EventDTO[] = [];
    for (const post of this.events.values()) {
      if (id === post['user_id']) {
        user_events.push(post);
      }
    }
    return Promise.resolve(user_events);
  }

  public getMyEvents(id: string, pagination: PaginationDTO): Promise<EventDTO[]> {
    const user_events: EventDTO[] = [];
    for (const post of this.events.values()) {
      if (id === post['user_id']) {
        user_events.push(post);
      }
    }
    return Promise.resolve(user_events);
  }
}
