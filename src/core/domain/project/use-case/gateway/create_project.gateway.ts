import Create from '@core/common/persistence/create';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';

export default interface CreateProjectGateway extends Create<ProjectDTO> {}
