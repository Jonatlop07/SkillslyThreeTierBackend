import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';
export default interface GetEventAssistantCollectionOutputModel {
  users: SearchedUserDTO[];
}