import { GetCommentsInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/get_comments_in_permanent_post.interactor';
import { Inject } from '@nestjs/common';
import GetCommentInPermanentPostGateway
  from '@core/domain/comment/use-case/gateway/get_comments_in_permanent_post.gateway';
import GetCommentsInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_permanent_post.input_model';
import {
  GetCommentsInPermanentPostOutputModel
} from '@core/domain/comment/use-case/output_model/get_comments_in_permanent_post.output_model';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';

export class GetCommentsInPermanentPostService implements GetCommentsInPermanentPostInteractor {
  constructor(
    @Inject(CommentDITokens.CommentRepository)
    private readonly gateway: GetCommentInPermanentPostGateway
  ) {
  }

  public async execute(input: GetCommentsInPermanentPostInputModel)
    : Promise<GetCommentsInPermanentPostOutputModel> {
    const comments = await this.gateway.findAll({
      postID: input.postID
    }, {
      offset: input.page,
      limit: input.limit
    });
    const results = [];
    for (const comment of comments) {
      results.push({
        comment_id: comment.comment_id,
        comment: comment.comment,
        timestamp: comment.timestamp
      });
    }
    return {
      comments: results
    };
  }
}
