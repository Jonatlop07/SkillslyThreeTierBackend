import { Inject, Logger } from '@nestjs/common';
import { UpdateProjectInteractor } from '@core/domain/project/use-case/interactor/update_project.interactor';
import { UpdateProjectGateway } from '@core/domain/project/use-case/gateway/update_project.gateway';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { UpdateProjectOutputModel } from '@core/domain/project/use-case/output-model/update_project.output_model';
import UpdateProjectInputModel from '@core/domain/project/use-case/input-model/update_project.input_model';
import { ProjectMapper } from '@core/domain/project/use-case/mapper/project.mapper';
import {
  EmptyProjectContentException,
  NonExistentProjectException
} from '@core/domain/project/use-case/exception/project.exception';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import { Project } from '@core/domain/project/entity/project';

export class UpdateProjectService implements UpdateProjectInteractor {
  private readonly logger: Logger = new Logger();

  constructor(
    @Inject(ProjectDITokens.ProjectRepository)
    private readonly gateway: UpdateProjectGateway
  ) {
  }

  async execute(input: UpdateProjectInputModel): Promise<UpdateProjectOutputModel> {
    const project: Project = ProjectMapper.toProject({
      project_id: input.project_id,
      owner_id: input.owner_id,
      title: input.title,
      members: input.members,
      description: input.description,
      reference: input.reference,
      reference_type: input.reference_type,
      annexes: input.annexes
    });
    if (!project.hasNonEmptyContent())
      throw new EmptyProjectContentException();
    const matching_project: ProjectDTO = await this.gateway.findOne({ project_id: input.project_id });
    if (!matching_project)
      throw new NonExistentProjectException();
    const updated_project: ProjectDTO = await this.gateway.update(ProjectMapper.toProjectDTO(project));
    return updated_project as UpdateProjectOutputModel;
  }
}
