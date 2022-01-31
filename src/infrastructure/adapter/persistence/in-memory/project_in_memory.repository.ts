import ProjectRepository from '@core/domain/project/use-case/repository/project.repository';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import ProjectQueryModel from "@core/domain/project/use-case/query-model/project.query_model";
import {Optional} from "@core/common/type/common_types";

export class ProjectInMemoryRepository implements ProjectRepository {
  private currently_available_project_id: string;

  constructor(private readonly project: Map<string, ProjectDTO>) {
    this.currently_available_project_id = '1';
  }

  public create(project: ProjectDTO): Promise<ProjectDTO> {
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

  findAll(params: ProjectQueryModel): Promise<ProjectDTO[]> {
    const user_projects: ProjectDTO[] = [];
    for (const project of this.project.values()) {
      if (Object.keys(params).every((key: string) => {
        return params[key] === project[key];
      })) {
        user_projects.push(project);
      }
    }
    return Promise.resolve(user_projects);
  }

  findAllWithRelation(params: ProjectQueryModel): Promise<any> {
    return Promise.resolve(undefined);
  }

  findOne(params: ProjectQueryModel): Promise<Optional<ProjectDTO>> {
    for (const project of this.project.values()) {
      if (Object.keys(params).every((key: string) => params[key] === project[key])) {
        return Promise.resolve(project);
      }
    }
    return Promise.resolve(undefined);
  }
}
