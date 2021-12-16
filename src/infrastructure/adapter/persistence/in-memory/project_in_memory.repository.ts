import ProjectRepository from '@core/domain/project/use-case/repository/project.repository';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';

export class ProjectInMemoryRepository implements ProjectRepository {
  private currently_available_project_id: string;

  constructor(private readonly project: Map<string, ProjectDTO>) {
    this.currently_available_project_id = '1';
  }

  public create(project: ProjectDTO): Promise<ProjectDTO> {
    console.log(project);
    const new_project: ProjectDTO = {
      project_id: this.currently_available_project_id,
      user_id: project.user_id,
      title: project.title,
      members: project.members,
      description: project.description,
      reference: project.reference,
      reference_type: project.reference_type,
      annexes: project.annexes,
    };
    this.project.set(this.currently_available_project_id, new_project);
    this.currently_available_project_id = `${
      Number(this.currently_available_project_id) + 1
    }`;
    return Promise.resolve(new_project);
  }
}
