import Create from '@core/common/persistence/create';
import { GroupDTO } from '../persistence-dto/group.dto';

export default interface CreateGroupGateway extends Create<GroupDTO> {}
