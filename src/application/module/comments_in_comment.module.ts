import { Module, Provider } from '@nestjs/common';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { CommentsInCommentNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/comments_in_comment/neo4j_comments_in_comment_repository.adapter';
import { CreateCommentInCommentService } from '@core/service/comment/create_comment_in_comment.service';
import { GetCommentsInCommentService } from '@core/service/comment/get_comments_in_comment.service';
import { CommentsInCommentController } from '@application/api/http-rest/controller/comments_in_comment.controller';

const persistence_providers: Array<Provider> = [
  {
    provide: CommentDITokens.CommentInCommentRepository,
    useClass: CommentsInCommentNeo4jRepositoryAdapter,
  },
];

const use_cases_providers: Array<Provider> = [
  {
    provide: CommentDITokens.CreateCommentInCommentInteractor,
    useFactory: (gateway) => new CreateCommentInCommentService(gateway),
    inject: [CommentDITokens.CommentInCommentRepository],
  },
  {
    provide: CommentDITokens.GetCommentsInCommentInteractor,
    useFactory: (gateway) => new GetCommentsInCommentService(gateway),
    inject: [CommentDITokens.CommentInCommentRepository],
  },
];


@Module({
  controllers: [CommentsInCommentController],
  providers: [
    ...persistence_providers,
    ...use_cases_providers,
  ],
  exports: [CommentDITokens.CommentInCommentRepository],
})
export class CommentsInCommentModule {
}