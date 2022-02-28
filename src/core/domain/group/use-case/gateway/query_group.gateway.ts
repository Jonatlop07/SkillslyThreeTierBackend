import { GroupDTO } from '../persistence-dto/group.dto';
import ExistsJoinRequest from '../persistence/join-request/exists_join_request';
import QueryOwners from '../persistence/query_group_owners';
import QueryUsers from '../persistence/query_group_users';
import GroupQueryModel from '../query-model/group.query_model';
import FindOne from '@core/common/persistence/find/find_one';

export default interface QueryGroupGateway
  extends QueryUsers, QueryOwners, ExistsJoinRequest, FindOne<GroupQueryModel, GroupDTO>{}
