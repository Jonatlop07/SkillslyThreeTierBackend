import LeaveGroup from '../persistence/leave_group';
import QueryOwners from '../persistence/query_group_owners';

export default interface LeaveGroupGateway extends LeaveGroup, QueryOwners{}
