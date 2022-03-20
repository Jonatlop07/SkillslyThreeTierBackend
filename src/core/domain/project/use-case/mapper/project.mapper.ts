import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import { Project } from '@core/domain/project/entity/project';
import CreateProjectInputModel from '../input-model/create_project.input_model';

export class ProjectMapper {
  public static toProjectDTO(project: Project): ProjectDTO {
    return {
      project_id: project.id,
      owner_id: project.owner_id,
      title: project.title,
      members: project.members,
      description: project.description,
      reference: project.reference,
      reference_type: project.reference_type,
      annexes: project.annexes,
    };
  }

  public static toProject(projectDTO: ProjectDTO): Project {
    return new Project({
      id: projectDTO.project_id,
      owner_id: projectDTO.owner_id,
      title: projectDTO.title,
      members: projectDTO.members,
      description: projectDTO.description,
      reference: projectDTO.reference,
      reference_type: projectDTO.reference_type,
      annexes: projectDTO.annexes,
    });
  }

  public static toProjectFromInput(input: CreateProjectInputModel): Project {
    return new Project({
      owner_id: input.owner_id,
      title: input.title,
      members: input.members,
      description: input.description,
      reference: input.reference,
      reference_type: input.reference_type,
      annexes: input.annexes,
    });
  }
}
