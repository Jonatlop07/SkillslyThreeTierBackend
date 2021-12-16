import Find from '@core/common/persistence/find';
import { GroupDTO } from '../persistence-dto/group.dto';
import QueryUsers from '../persistence/query_group_users';
import GroupQueryModel from '../query-model/group.query_model';

export default interface QueryGroupUsersGateway extends QueryUsers, Find<GroupDTO, GroupQueryModel>{}
