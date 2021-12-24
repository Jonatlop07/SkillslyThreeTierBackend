import { PaginationDTO } from '@application/api/http-rest/http-dto/pagination.dto';
import { GroupUserDTO } from '../persistence-dto/group_users.dto';
import GroupQueryModel from '../query-model/group.query_model';

export default interface QueryUsers {
  userIsMember(param: GroupQueryModel): Promise<boolean>;
  queryUsers(group_id: string, pagination: PaginationDTO): Promise<Array<GroupUserDTO>>;
}
