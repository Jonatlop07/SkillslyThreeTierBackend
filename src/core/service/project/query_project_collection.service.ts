import { Inject, Logger } from '@nestjs/common';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { ProjectDTO } from '@core/domain/project/use-case/persistence-dto/project.dto';
import QueryProjectInputModel from '@core/domain/project/use-case/input-model/query_project_collection.input_model';
import QueryProjectOutputModel from '@core/domain/project/use-case/output-model/query_project_collection.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { NonExistentUserException } from '@core/domain/project/use-case/exception/project.exception';
import {
  QueryProjectCollectionInteractor
} from '@core/domain/project/use-case/interactor/query_project_collection.interactor';
import QueryProjectCollectionGateway from '@core/domain/project/use-case/gateway/query_project_collection.gateway';

export class QueryProjectCollectionService implements QueryProjectCollectionInteractor {
  private readonly logger: Logger = new Logger(QueryProjectCollectionService.name);

  constructor(
    @Inject(ProjectDITokens.ProjectRepository)
    private readonly gateway: QueryProjectCollectionGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: SearchUsersGateway
  ) {
  }

  async execute(
    input: QueryProjectInputModel
  ): Promise<QueryProjectOutputModel> {
    const user = await this.user_gateway.findOne({ user_id: input.owner_id });
    if (!user) {
      throw new NonExistentUserException();
    }
    const projects: Array<ProjectDTO> = await this.gateway.findAll({
      owner_id: input.owner_id
    });
    return {
      projects
    };
  }
}
