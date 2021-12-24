import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';

export default interface GetEventAssistantCollection {
  getEventAssistantCollection(id: string): Promise<Array<SearchedUserDTO>>;
}