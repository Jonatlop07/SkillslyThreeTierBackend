import ProjectQueryModel from '@core/domain/project/use-case/query-model/project.query_model';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import FindOne from '@core/common/persistence/find/find_one';
import FindAll from '@core/common/persistence/find/find_all';

export default interface QueryProjectCollectionGateway
  extends FindOne<ProjectQueryModel, ProjectDTO>, FindAll<ProjectQueryModel, ProjectDTO> {
}
