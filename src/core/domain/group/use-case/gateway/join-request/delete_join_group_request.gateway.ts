import DeleteJoinRequest from '../../persistence/join-request/delete_join_request';
import ExistsJoinRequest from '../../persistence/join-request/exists_join_request';

export default interface DeleteJoinGroupRequestGateway extends ExistsJoinRequest, DeleteJoinRequest{}
