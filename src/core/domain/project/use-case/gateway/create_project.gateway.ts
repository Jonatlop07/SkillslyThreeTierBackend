import Create from '@core/common/persistence/create';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import CreateProjectPersistenceDTO from '@core/domain/project/use-case/persistence-dto/create_project.persistence_dto';

export default interface CreateProjectGateway extends Create<CreateProjectPersistenceDTO, ProjectDTO> {}
