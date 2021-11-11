import { Module, Provider } from '@nestjs/common';
import { PermanentPostController } from '@application/api/http-rest/controller/permanent_post.controller';
import { PermanentPostNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/post/neo4j_permanent_post_repository.adapter';
import { CreatePermanentPostService } from '@core/service/post/create_permanent_post.service';
import { UpdatePermanentPostService } from '@core/service/post/update_permanent_post.service';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';

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
  },
  {
    provide: PostDITokens.UpdatePermanentPostInteractor,
    useFactory: (gateway) => new UpdatePermanentPostService(gateway),
    inject: [ PostDITokens.PermanentPostRepository]
  },
];

@Module({
  controllers: [
    PermanentPostController
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
