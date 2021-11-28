import { ReactionController } from '@application/api/http-rest/controller/reaction.controller';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { AddReactionService } from '@core/service/reaction/add_reaction.service';
import { QueryReactionsService } from '@core/service/reaction/query_reactions.service';
import { PermanentPostNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/post/neo4j_permanent_post_repository.adapter';
import { ReactionNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/reaction/neo4j_reaction_repository.adapter';
import { Module, Provider } from '@nestjs/common';

const persistence_providers: Array<Provider> = [
  {
    provide: ReactionDITokens.ReactionRepository,
    useClass: ReactionNeo4jRepositoryAdapter
  },
  {
    provide: PostDITokens.PermanentPostRepository,
    useClass: PermanentPostNeo4jRepositoryAdapter
  }
];

const use_case_providers: Array<Provider> = [
  {
    provide: ReactionDITokens.AddReactionInteractor,
    useFactory: (reaction_gateway, post_gateway) => new AddReactionService(reaction_gateway, post_gateway),
    inject: [ReactionDITokens.ReactionRepository, PostDITokens.PermanentPostRepository]
  },
  {
    provide: ReactionDITokens.QueryReactionsInteractor,
    useFactory: (reaction_gateway, post_gateway) => new QueryReactionsService(reaction_gateway, post_gateway),
    inject: [ReactionDITokens.ReactionRepository, PostDITokens.PermanentPostRepository]
  }
];

@Module({
  controllers: [
    ReactionController
  ],
  providers: [
    ...persistence_providers,
    ...use_case_providers
  ],
  exports: [
    PostDITokens.PermanentPostRepository,
    ReactionDITokens.ReactionRepository
  ]
})
export class ReactionModule {}
