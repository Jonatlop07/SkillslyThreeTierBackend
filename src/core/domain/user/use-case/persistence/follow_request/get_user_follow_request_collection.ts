import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';

export default interface GetUserFollowRequestCollection {
  getUserFollowRequestCollection(id: string): Promise<Array<Array<SearchedUserDTO>>>;
}