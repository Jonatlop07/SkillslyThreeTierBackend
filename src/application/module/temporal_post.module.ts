import { Module, Provider } from '@nestjs/common';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import { TemporalPostNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/temporal-post/neo4j_temporal_post_repository.adapter';
import { CreateTemporalPostService } from '@core/service/temporal-post/create_temporal_post.service';
import { TemporalPostController } from '@application/api/http-rest/controller/temporal_post.controller';
import { QueryTemporalPostCollectionService } from '@core/service/temporal-post/query_temporal_post_collection.service';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserModule } from '@application/module/user.module';
import { DeleteTemporalPostService } from '@core/service/temporal-post/delete_temporal_post.service';
import { QueryTemporalPostFriendsCollectionService } from '@core/service/temporal-post/query_temporal_post_friends_collection.service';


const persistence_providers: Array<Provider> = [
  {
    provide: TempPostDITokens.TempPostRepository,
    useClass: TemporalPostNeo4jRepositoryAdapter,
  },
];

const use_case_providers: Array<Provider> = [
  {
    provide: TempPostDITokens.CreateTempPostInteractor,
    useFactory: (gateway) => new CreateTemporalPostService(gateway),
    inject: [TempPostDITokens.TempPostRepository],
  },

  {
    provide: TempPostDITokens.QueryTemporalPostCollectionInteractor,
    useFactory: (temp_post_gateway, user_gateway) => new QueryTemporalPostCollectionService(temp_post_gateway, user_gateway),
    inject: [TempPostDITokens.TempPostRepository, UserDITokens.UserRepository],
  },
  {
    provide: TempPostDITokens.QueryTemporalPostFriendsCollectionInteractor,
    useFactory: (temp_post_gateway, user_gateway) => new QueryTemporalPostFriendsCollectionService(temp_post_gateway, user_gateway),
    inject: [TempPostDITokens.TempPostRepository, UserDITokens.UserRepository],
  },
  {
    provide: TempPostDITokens.DeleteTemporalPostInteractor,
    useFactory: (gateway) => new DeleteTemporalPostService(gateway),
    inject: [TempPostDITokens.TempPostRepository],
  },
];

@Module({
  imports: [UserModule],
  controllers: [
    TemporalPostController,
  ],
  providers: [
    ...persistence_providers,
    ...use_case_providers,
  ],
  exports: [TempPostDITokens.TempPostRepository],
})
export class TempPostModule {
}
