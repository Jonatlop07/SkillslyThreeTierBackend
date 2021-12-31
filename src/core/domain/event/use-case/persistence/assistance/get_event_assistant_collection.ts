import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';
import { EventDTO } from '@core/domain/event/use-case/persistence-dto/event.dto';

export default interface GetEventAssistantCollection {
  getEventAssistantCollection(id: string): Promise<Array<SearchedUserDTO>>;
  getMyEventAssistantCollection(id: string): Promise<Array<EventDTO>>;
}