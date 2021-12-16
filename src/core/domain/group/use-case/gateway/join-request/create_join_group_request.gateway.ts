import CreateJoinRequest from '../../persistence/join-request/create_join_request';
import ExistsJoinRequest from '../../persistence/join-request/exists_join_request';
import QueryOwners from '../../persistence/query_group_owners';

export default interface CreateJoinGroupRequestGateway extends ExistsJoinRequest, QueryOwners, CreateJoinRequest{}
