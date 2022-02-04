import { Inject, Injectable, Logger } from '@nestjs/common';
import { DeleteProjectInteractor } from '@core/domain/project/use-case/interactor/delete_project.interactor';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import DeleteProjectGateway from '@core/domain/project/use-case/gateway/delete_project.gateway';
import DeleteProjectInputModel from '@core/domain/project/use-case/input-model/delete_project.input_model';
import DeleteProjectOutputModel from '@core/domain/project/use-case/output-model/delete_project.output_model';

@Injectable()
export class DeleteProjectService implements DeleteProjectInteractor {
  private readonly logger: Logger = new Logger(DeleteProjectService.name);

  constructor(
    @Inject(ProjectDITokens.ProjectRepository)
    private readonly gateway: DeleteProjectGateway,
  ) {}

  async execute(
    input: DeleteProjectInputModel,
  ): Promise<DeleteProjectOutputModel> {
    await this.gateway.deleteById(input.project_id);
    return {};
  }
}
