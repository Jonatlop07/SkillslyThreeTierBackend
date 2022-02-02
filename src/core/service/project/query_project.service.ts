import { Inject, Logger } from '@nestjs/common';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import QueryProjectGateway from '@core/domain/project/use-case/gateway/query_project.gateway';
import QueryProjectInputModel from '@core/domain/project/use-case/input-model/query_project.input_model';
import QueryProjectOutputModel from '@core/domain/project/use-case/output-model/query_project.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { NonExistentUserException } from '@core/domain/project/use-case/exception/project.exception';
import { QueryProjectInteractor } from '@core/domain/project/use-case/interactor/query_project.interactor';
import {NonExistentProjectException} from "@core/domain/project/use-case/exception/project.exception";

export class QueryProjectService implements QueryProjectInteractor {
  private readonly logger: Logger = new Logger(QueryProjectService.name);
  constructor(
    @Inject(ProjectDITokens.ProjectRepository)
    private readonly gateway: QueryProjectGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: SearchUsersGateway,
  ) {}

  async execute(
    input: QueryProjectInputModel,
  ): Promise<QueryProjectOutputModel> {
    let projects: Array<ProjectDTO> = [];
    const user = await this.user_gateway.findOne({ user_id: input.user_id });
    if (!user) {
      throw new NonExistentUserException();
    }
    projects = await this.gateway.findAll({
      user_id: input.user_id,
    });
    if (!projects || projects.length < 1 ){
      throw new NonExistentProjectException();
    }
    return Promise.resolve({
      projects
    });
  }
}
