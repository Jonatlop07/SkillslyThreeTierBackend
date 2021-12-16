import CreateGroupGateway from '../gateway/create_group.gateway';
import DeleteGroupGateway from '../gateway/delete_group.gateway';
import CreateJoinGroupRequestGateway from '../gateway/join-request/create_join_group_request.gateway';
import DeleteJoinGroupRequestGateway from '../gateway/join-request/delete_join_group_request.gateway';
import GetJoinRequestsGateway from '../gateway/join-request/get_join_requests.gateway';
import UpdateGroupUserGateway from '../gateway/join-request/update_group_user.gateway';
import LeaveGroupGateway from '../gateway/leave_group.gateway';
import QueryGroupGateway from '../gateway/query_group.gateway';
import QueryGroupCollectionGateway from '../gateway/query_group_collection.gateway';
import QueryGroupUsersGateway from '../gateway/query_group_users.gateway';
import UpdateGroupGateway from '../gateway/update_group.gateway';
export default interface GroupRepository
  extends CreateGroupGateway, UpdateGroupGateway, 
  DeleteGroupGateway, CreateJoinGroupRequestGateway, 
  DeleteJoinGroupRequestGateway, UpdateGroupUserGateway,
  LeaveGroupGateway, QueryGroupGateway, QueryGroupCollectionGateway,
  GetJoinRequestsGateway, QueryGroupUsersGateway { }
