import Create from '@core/common/persistence/create';
import { GroupDTO } from '../persistence-dto/group.dto';
import CreateGroupPersistenceDTO from '@core/domain/group/use-case/persistence-dto/create_group.persistence_dto';

export default interface CreateGroupGateway extends Create<CreateGroupPersistenceDTO, GroupDTO> {}
