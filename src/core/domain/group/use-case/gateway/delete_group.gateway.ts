import Delete from '@core/common/persistence/delete';
import { GroupDTO } from '../persistence-dto/group.dto';
import QueryOwners from '../persistence/query_group_owners';
import GroupQueryModel from '../query-model/group.query_model';

export default interface DeleteGroupGateway extends Delete<GroupDTO, GroupQueryModel>, QueryOwners{}
