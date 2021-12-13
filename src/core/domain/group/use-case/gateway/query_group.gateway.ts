import Find from '@core/common/persistence/find';
import { GroupDTO } from '../persistence-dto/group.dto';
import QueryOwners from '../persistence/query_group_owners';
import QueryUsers from '../persistence/query_group_users';
import GroupQueryModel from '../query-model/group.query_model';

export default interface QueryGroupGateway extends QueryUsers, QueryOwners, Find<GroupDTO, GroupQueryModel>{}
