import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';

export default interface SearchUsersOutputModel{
  users: Array<SearchedUserDTO>
}
