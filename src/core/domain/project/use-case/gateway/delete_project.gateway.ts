import Delete from '@core/common/persistence/delete';
import ProjectQueryModel from '@core/domain/project/use-case/query-model/project.query_model';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';

export default interface DeleteProjectGateway extends Delete<ProjectQueryModel, ProjectDTO> {}
