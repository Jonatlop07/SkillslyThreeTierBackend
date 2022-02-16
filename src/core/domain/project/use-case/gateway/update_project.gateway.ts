import Update from '@core/common/persistence/update';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import ProjectQueryModel from '@core/domain/project/use-case/query-model/project.query_model';
import FindOne from '@core/common/persistence/find/find_one';

export interface UpdateProjectGateway extends Update<ProjectDTO>, FindOne<ProjectQueryModel, ProjectDTO> {
}
