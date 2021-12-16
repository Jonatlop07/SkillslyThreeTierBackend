import ExistsJoinRequest from '../../persistence/join-request/exists_join_request';
import UpdateGroupUser from '../../persistence/join-request/update_user';
import QueryOwners from '../../persistence/query_group_owners';

export default interface UpdateGroupUserGateway extends ExistsJoinRequest, QueryOwners, UpdateGroupUser{}
