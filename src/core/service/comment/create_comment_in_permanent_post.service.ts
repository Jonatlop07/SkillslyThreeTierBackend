import { CreateCommentInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_permanent_post.interactor';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { Inject } from '@nestjs/common';
import CreateCommentInPermanentPostGateway
  from '@core/domain/comment/use-case/gateway/create_comment_in_permanent_post.gateway';
import CreateCommentInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_permanent_post.input_model';
import CreateCommentInPermanentPostOutputModel
  from '@core/domain/comment/use-case/output_model/create_comment_in_permanent_post.output_model';
import { isValidTimestamp } from '@core/common/util/validators/comment.validators';
import { CommentInvalidDataFormatException } from '@core/domain/comment/use-case/exception/comment.exception';

export class CreateCommentInPermanentPostService implements CreateCommentInPermanentPostInteractor {
  constructor(@Inject(CommentDITokens.CommentRepository) private readonly gateway: CreateCommentInPermanentPostGateway) {
  }

  async execute(input: CreateCommentInPermanentPostInputModel): Promise<CreateCommentInPermanentPostOutputModel> {
    if (input['comment'].length === 0 || !isValidTimestamp(input['timestamp'])) {
      throw new CommentInvalidDataFormatException();
    }
    const createdComment = await this.gateway.create({
      comment: input['comment'],
      timestamp: input['timestamp'],
      postID: input['postID'],
      userID: input['userID'],
    });

    return Promise.resolve({
      commentID: createdComment['comment_id'],
      comment: createdComment['comment'],
      timestamp: createdComment['timestamp'],
      postID: createdComment['postID'],
      userID: createdComment['userID'],
    });
  }
}
