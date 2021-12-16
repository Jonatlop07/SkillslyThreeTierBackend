import Update from '@core/common/persistence/update';
import { GroupDTO } from '../persistence-dto/group.dto';
import QueryOwners from '../persistence/query_group_owners';

export default interface UpdateGroupGateway extends Update<GroupDTO>, QueryOwners{}
