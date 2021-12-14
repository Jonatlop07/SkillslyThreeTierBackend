import { Module, Provider } from '@nestjs/common';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import { TemporalPostNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/temp-post/neo4j.temporal_post_repository.adapter';
import { CreateTemporalPostService } from '@core/service/temp-post/create_temporal_post.service';
import { TemporalPostController } from '@application/api/http-rest/controller/temporal_post.controller';

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
];

@Module({
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