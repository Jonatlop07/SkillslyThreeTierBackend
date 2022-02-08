import { CreateCommentInCommentInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_comment.interactor';
import { Inject } from '@nestjs/common';

import CreateCommentInCommentGateway from '@core/domain/comment/use-case/gateway/create_comment_in_comment.gateway';
import { isValidTimestamp } from '@core/common/util/validators/comment.validators';
import { CommentInvalidDataFormatException } from '@core/domain/comment/use-case/exception/comment.exception';
import CreateCommentInCommentInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_comment.input_model';
import CreateCommentInCommentOutputModel
  from '@core/domain/comment/use-case/output_model/create_comment_in_comment.output_model';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';

export class CreateCommentInCommentService implements CreateCommentInCommentInteractor {
  constructor(
    @Inject(CommentDITokens.CommentInCommentRepository)
    private readonly gateway: CreateCommentInCommentGateway
  ) {
  }

  public async execute(input: CreateCommentInCommentInputModel): Promise<CreateCommentInCommentOutputModel> {
    if (input.comment.length === 0 || !isValidTimestamp(input.timestamp)) {
      throw new CommentInvalidDataFormatException();
    }
    const createdComment = await this.gateway.create({
      comment: input.comment,
      timestamp: input.timestamp,
      userID: input.userID,
      ancestorCommentID: input.ancestorCommentID,
    });
    return {
      commentID: createdComment.comment_id,
      ancestorCommentID: createdComment.ancestorCommentID,
      comment: createdComment.comment,
      userID: createdComment.userID,
      timestamp: createdComment.timestamp,
    };
  }
}
