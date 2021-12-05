import { Module, Provider } from '@nestjs/common';
import { UserModule } from '@application/module/user.module';
import { PermanentPostController } from '@application/api/http-rest/controller/permanent_post.controller';
import { PermanentPostNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/post/neo4j_permanent_post_repository.adapter';
import { CreatePermanentPostService } from '@core/service/post/create_permanent_post.service';
import { UpdatePermanentPostService } from '@core/service/post/update_permanent_post.service';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { QueryPermanentPostCollectionService } from '@core/service/post/query_permanent_post_collection.service';
import { QueryPermanentPostService } from '@core/service/post/query_permanent_post.service';
import { SharePermanentPostService } from '@core/service/post/share_permanent_post.service';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { AddReactionService } from '@core/service/reaction/add_reaction.service';
import { QueryReactionsService } from '@core/service/reaction/query_reactions.service';
import { ReactionNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/reaction/neo4j_reaction_repository.adapter';
import { DeletePermanentPostService } from '@core/service/post/delete_permanent_post.service';

const persistence_providers: Array<Provider> = [
  {
    provide: PostDITokens.PermanentPostRepository,
    useClass: PermanentPostNeo4jRepositoryAdapter,
  }, {
    provide: ReactionDITokens.ReactionRepository,
    useClass: ReactionNeo4jRepositoryAdapter,
  }
];

const use_case_providers: Array<Provider> = [
  {
    provide: PostDITokens.CreatePermanentPostInteractor,
    useFactory: (gateway) => new CreatePermanentPostService(gateway),
    inject: [PostDITokens.PermanentPostRepository]
  },
  {
    provide: PostDITokens.UpdatePermanentPostInteractor,
    useFactory: (gateway) => new UpdatePermanentPostService(gateway),
    inject: [PostDITokens.PermanentPostRepository]
  },
  {
    provide: PostDITokens.QueryPermanentPostCollectionInteractor,
    useFactory: (user_gateway, relationship_gateway, post_gateway) => new QueryPermanentPostCollectionService(user_gateway, relationship_gateway, post_gateway),
    inject: [UserDITokens.UserRepository, UserDITokens.UserRepository, PostDITokens.PermanentPostRepository]
  },
  {
    provide: PostDITokens.QueryPermanentPostInteractor,
    useFactory: (post_gateway, user_gateway) => new QueryPermanentPostService(post_gateway, user_gateway),
    inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository]
  },
  {
    provide: PostDITokens.DeletePermanentPostInteractor,
    useFactory: (post_gateway) => new DeletePermanentPostService(post_gateway),
    inject: [PostDITokens.PermanentPostRepository]
  },
  {
    provide: PostDITokens.SharePermanentPostInteractor,
    useFactory: (post_gateway, user_gateway) => new SharePermanentPostService(post_gateway, user_gateway),
    inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository]
  },
  {
    provide: ReactionDITokens.AddReactionInteractor,
    useFactory: (reaction_gateway, post_gateway) => new AddReactionService(reaction_gateway, post_gateway),
    inject: [ReactionDITokens.ReactionRepository, PostDITokens.PermanentPostRepository],
  },
  {
    provide: ReactionDITokens.QueryReactionsInteractor,
    useFactory: (reaction_gateway, post_gateway) => new QueryReactionsService(reaction_gateway, post_gateway),
    inject: [ReactionDITokens.ReactionRepository, PostDITokens.PermanentPostRepository],
  }
];

@Module({
  imports: [UserModule],
  controllers: [
    PermanentPostController
  ],
  providers: [
    ...persistence_providers,
    ...use_case_providers
  ],
  exports: [
    PostDITokens.PermanentPostRepository,
  ]
})
export class PostModule { }
