import { SearchedUserDTO } from '../persistence-dto/searched_user.dto';

export default interface SearchUsersOutputModel{
  users: SearchedUserDTO[]
}