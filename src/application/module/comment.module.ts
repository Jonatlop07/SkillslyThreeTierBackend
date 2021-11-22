import { Module, Provider } from '@nestjs/common';

import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { CommentNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/comment/neo4j_comment_repository.adapter';

import { CreateCommentInPermanentPostService } from '@core/service/comment/create_comment_in_permanent_post.service';
import { CommentController } from '@application/api/http-rest/controller/comment.controller';
import { GetCommentsInPermanentPostService } from '@core/service/comment/get_comments_in_permanent_post';

const persistence_providers: Array<Provider> = [
  {
    provide: CommentDITokens.CommentRepository,
    useClass: CommentNeo4jRepositoryAdapter,
  },
];

const use_case_providers: Array<Provider> = [
  {
    provide: CommentDITokens.CreateCommentInPermanentPostInteractor,
    useFactory: (gateway) => new CreateCommentInPermanentPostService(gateway),
    inject: [CommentDITokens.CommentRepository],
  },
  {
    provide: CommentDITokens.GetCommentsInPermamentPostInteractor,
    useFactory: (gateway) => new GetCommentsInPermanentPostService(gateway),
    inject: [CommentDITokens.CommentRepository],
  },
];

@Module({
  controllers: [CommentController],
  providers: [...persistence_providers, ...use_case_providers],
  exports: [CommentDITokens.CommentRepository],
})
export class CommentModule {
}