import { Module, Provider } from '@nestjs/common';
import { UserModule } from '@application/module/user.module';
import { ProjectController } from '@application/api/http-rest/controller/project.controller';
import { ProjectNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/project/neo4j_project_repository.adapter';
import { CreateProjectService } from '@core/service/project/create_project.service';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { QueryProjectCollectionService } from '@core/service/project/query_project_collection.service';
import { DeleteProjectService } from '@core/service/project/delete_project.service';
import { UpdateProjectService } from '@core/service/project/update_project.service';


const persistence_providers: Array<Provider> = [
  {
    provide: ProjectDITokens.ProjectRepository,
    useClass: ProjectNeo4jRepositoryAdapter
  }
];

const use_case_providers: Array<Provider> = [
  {
    provide: ProjectDITokens.CreateProjectInteractor,
    useFactory: (gateway) => new CreateProjectService(gateway),
    inject: [ProjectDITokens.ProjectRepository]
  },
  {
    provide: ProjectDITokens.QueryProjectCollectionInteractor,
    useFactory: (project_gateway, user_gateway) => new QueryProjectCollectionService(project_gateway, user_gateway),
    inject: [ProjectDITokens.ProjectRepository, UserDITokens.UserRepository]
  },
  {
    provide: ProjectDITokens.DeleteProjectInteractor,
    useFactory: (project_gateway) => new DeleteProjectService(project_gateway),
    inject: [ProjectDITokens.ProjectRepository]
  },
  {
    provide: ProjectDITokens.UpdateProjectInteractor,
    useFactory: (gateway) => new UpdateProjectService(gateway),
    inject: [ProjectDITokens.ProjectRepository]
  }
];

@Module({
  imports: [UserModule],
  controllers: [ProjectController],
  providers: [...persistence_providers, ...use_case_providers],
  exports: [ProjectDITokens.ProjectRepository]
})
export class ProjectModule {
}
