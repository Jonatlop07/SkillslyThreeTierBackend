import { GetCommentsInCommentInteractor } from '@core/domain/comment/use-case/interactor/get_comments_in_comment.interactor';
import { Inject } from '@nestjs/common';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import GetCommentsInCommentGateway from '@core/domain/comment/use-case/gateway/get_comment_in_comments.gateway';
import GetCommentsInCommentInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_comment.input_model';
import { GetCommentsInCommentOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_comment.output_model';

export class GetCommentsInCommentService implements GetCommentsInCommentInteractor {
  constructor(
    @Inject(CommentDITokens.CommentInCommentRepository)
    private readonly gateway: GetCommentsInCommentGateway
  ) {
  }

  public async execute(input: GetCommentsInCommentInputModel): Promise<GetCommentsInCommentOutputModel> {
    const comments = await this.gateway.findAll({
      ancestor_comment_id: input.ancestor_comment_id
    },
    {
      offset: input.page,
      limit: input.limit
    });
    return {
      comments
    };
  }
}
