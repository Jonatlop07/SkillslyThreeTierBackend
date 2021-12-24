import { PaginationDTO } from '@application/api/http-rest/http-dto/http_pagination.dto';
import { EventDTO } from '@core/domain/event/use-case/persistence-dto/event.dto';
import EventRepository from '@core/domain/event/use-case/repository/event.repository';
import { AssistanceDTO } from '@core/domain/event/use-case/persistence-dto/assistance.dto';
import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';

export class EventInMemoryRepository implements EventRepository {
  private currently_available_event_id: string;
  private currently_available_event_assistant_id: string;

  constructor(private readonly events: Map<string, EventDTO>) {
    this.currently_available_event_id = '1';
  }

  public create(event: EventDTO): Promise<EventDTO> {
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

  public createEventAssistant(params: AssistanceDTO): Promise<Object> {
    this.currently_available_event_assistant_id = params.user_id.concat(params.event_id);
    return Promise.resolve({});
  }

  public exists(t: EventDTO): Promise<boolean> {
    t;
    return Promise.resolve(false);
  }

  public existsEventAssistant(params: AssistanceDTO): Promise<boolean> {
    if (this.currently_available_event_assistant_id == params.user_id.concat(params.event_id)) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  public existsById(id: string): Promise<boolean> {
    if (this.currently_available_event_id == id) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  public getEventsOfFriends(id: string, pagination: PaginationDTO): Promise<EventDTO[]> {
    pagination;
    const user_events: EventDTO[] = [];
    for (const event of this.events.values()) {
      if (id === event['user_id']) {
        user_events.push(event);
      }
    }
    return Promise.resolve(user_events);
  }

  public getMyEvents(id: string, pagination: PaginationDTO): Promise<EventDTO[]> {
    pagination;
    const user_events: EventDTO[] = [];
    for (const event of this.events.values()) {
      if (id === event['user_id']) {
        user_events.push(event);
      }
    }
    return Promise.resolve(user_events);
  }

  public getEventAssistantCollection(id: string): Promise<SearchedUserDTO[]> {
    const event_assistants: SearchedUserDTO[] = [];
    for (const event of this.events.values()) {
      if (id === event['event_id']) {
        event_assistants.push({user_id: this.currently_available_event_assistant_id.slice(1, 1), email: '', date_of_birth: '', name: ''});
      }
    }
    return Promise.resolve(event_assistants);
  }

  public deleteEventAssistant(params: AssistanceDTO): Promise<Object> {
    params;
    this.currently_available_event_assistant_id = '';
    return Promise.resolve({});
  }
}
