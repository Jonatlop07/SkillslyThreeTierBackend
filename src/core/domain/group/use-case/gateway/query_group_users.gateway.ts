import { GroupDTO } from '../persistence-dto/group.dto';
import QueryUsers from '../persistence/query_group_users';
import GroupQueryModel from '../query-model/group.query_model';
import FindOne from '@core/common/persistence/find/find_one';

export default interface QueryGroupUsersGateway
  extends QueryUsers, FindOne<GroupQueryModel, GroupDTO> {}
