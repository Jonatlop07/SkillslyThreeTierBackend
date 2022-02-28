import { Inject } from '@nestjs/common';
import { EmptyProjectContentException } from '@core/domain/project/use-case/exception/project.exception';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import CreateProjectInputModel from '@core/domain/project/use-case/input-model/create_project.input_model';
import { CreateProjectInteractor } from '@core/domain/project/use-case/interactor/create_project.interactor';
import CreateProjectGateway from '@core/domain/project/use-case/gateway/create_project.gateway';
import CreateProjectOutputModel from '@core/domain/project/use-case/output-model/create_project.output_model';
import { Project } from '@core/domain/project/entity/project';
import { ProjectMapper } from '@core/domain/project/use-case/mapper/project.mapper';
import CreateProjectPersistenceDTO from '@core/domain/project/use-case/persistence-dto/create_project.persistence_dto';

export class CreateProjectService implements CreateProjectInteractor {
  constructor(
    @Inject(ProjectDITokens.ProjectRepository)
    private readonly gateway: CreateProjectGateway,
  ) {}

  async execute(input: CreateProjectInputModel): Promise<CreateProjectOutputModel> {
    const project_to_create: Project = ProjectMapper.toProjectFromInput(input);
    if (!project_to_create.hasNonEmptyContent()) {
      throw new EmptyProjectContentException();
    }
    return {
      created_project: await this.gateway.create(input as CreateProjectPersistenceDTO)
    };
  }
}
