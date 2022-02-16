import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';

export default interface QueryProjectCollectionOutputModel {
  projects: Array<ProjectDTO>;
}
