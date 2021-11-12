import { Module, Provider } from '@nestjs/common';
import { PermanentPostController } from '@application/api/http-rest/controller/permanent_post.controller';
import { PermanentPostNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/post/neo4j_permanent_post_repository.adapter';
import { CreatePermanentPostService } from '@core/service/post/create_permanent_post.service';
import { UpdatePermanentPostService } from '@core/service/post/update_permanent_post.service';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/user/neo4j_user_repository.adapter';
import { QueryPermanentPostCollectionService } from '@core/service/post/query_permanent_post_collection.service';
import { QueryPermanentPostService } from '@core/service/post/query_permanent_post.service';

const persistence_providers: Provider[] = [
  {
    provide: PostDITokens.PermanentPostRepository,
    useClass: PermanentPostNeo4jRepositoryAdapter
  },
  {
    provide: UserDITokens.UserRepository,
    useClass: UserNeo4jRepositoryAdapter
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
  {
    provide: PostDITokens.QueryPermanentPostCollectionInteractor,
    useFactory: (post_gateway, user_gateway) => new QueryPermanentPostCollectionService(post_gateway, user_gateway),
    inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository]
  },
  {
    provide: PostDITokens.QueryPermanentPostInteractor,
    useFactory: (post_gateway, user_gateway) => new QueryPermanentPostService(post_gateway, user_gateway),
    inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository]
  }
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
