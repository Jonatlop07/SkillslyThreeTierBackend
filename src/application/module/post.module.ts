import { Module, Provider } from '@nestjs/common';
import { PostDITokens } from '@core/domain/post/di/permanent_post_di_tokens';
import { PermanentPostNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/post/neo4j_permanent_post_repository.adapter';
import { CreatePermanentPostService } from '@core/service/post/create_permanent_post.service';
import { PostController } from '@application/api/http-rest/controller/post_controller';

const persistence_providers: Provider[] = [
  {
    provide: PostDITokens.PermanentPostRepository,
    useClass: PermanentPostNeo4jRepositoryAdapter
  }
];

const use_case_providers: Provider[] = [
  {
    provide: PostDITokens.CreatePermanentPostInteractor,
    useFactory: (gateway) => new CreatePermanentPostService(gateway),
    inject: [ PostDITokens.PermanentPostRepository]
  }
];

@Module({
  controllers: [
    PostController
  ],
  providers: [
    ...persistence_providers,
    ...use_case_providers
  ],
  exports: [
    PostDITokens.PermanentPostRepository
  ]
})
export class PostModule {

}
