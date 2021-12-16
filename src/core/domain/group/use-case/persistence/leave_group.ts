import { BasicGroupDTO } from '../persistence-dto/basic_group_data.dto';
import GroupQueryModel from '../query-model/group.query_model';

export default interface LeaveGroup {
  leaveGroup(param: GroupQueryModel): Promise<BasicGroupDTO>;
}
