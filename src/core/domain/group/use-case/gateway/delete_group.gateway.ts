import { GroupDTO } from '../persistence-dto/group.dto';
import QueryOwners from '../persistence/query_group_owners';
import GroupQueryModel from '../query-model/group.query_model';
import Delete from '@core/common/persistence/delete/delete';
import FindOne from '@core/common/persistence/find/find_one';

export default interface DeleteGroupGateway
  extends Delete<GroupQueryModel, GroupDTO>, QueryOwners, FindOne<GroupQueryModel, GroupDTO> {}
