import Create from '@core/common/persistence/create/create';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import CreateProfilePersistenceDTO from '@core/domain/profile/use-case/persistence-dto/create_profile.persistence_dto';

export default interface CreateProfileGateway extends Create<CreateProfilePersistenceDTO, ProfileDTO> {}
