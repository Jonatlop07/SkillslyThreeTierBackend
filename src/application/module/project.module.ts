import { Module, Provider } from '@nestjs/common';
import { UserModule } from '@application/module/user.module';
import { ProjectController } from '@application/api/http-rest/controller/project.controller';
import { ProjectNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/project/neo4j_project_repository.adapter';
import { CreateProjectService } from '@core/service/project/create_project.service';
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';

const persistence_providers: Array<Provider> = [
  {
    provide: ProjectDITokens.ProjectRepository,
    useClass: ProjectNeo4jRepositoryAdapter,
  },
];

const use_case_providers: Array<Provider> = [
  {
    provide: ProjectDITokens.CreateProjectInteractor,
    useFactory: (gateway) => new CreateProjectService(gateway),
    inject: [ProjectDITokens.ProjectRepository],
  },
];

@Module({
  imports: [UserModule],
  controllers: [ProjectController],
  providers: [...persistence_providers, ...use_case_providers],
  exports: [ProjectDITokens.ProjectRepository],
})
export class ProjectModule {}
