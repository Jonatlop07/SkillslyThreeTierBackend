import { GetCommentsInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/get_comments_in_permanent_post.interactor';
import { Inject } from '@nestjs/common';

import GetCommentInPermanentPostGateway
  from '@core/domain/comment/use-case/gateway/get_comments_in_permanent_post.gateway';
import CreateCommentInPermanentPostOutputModel
  from '@core/domain/comment/use-case/output_model/create_comment_in_permanent_post.output_model';
import { ThereAreNoCommentsException } from '@core/domain/comment/use-case/exception/comment.exception';
import GetCommentsInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_permanent_post.input_model';
import {
  GetCommentsInPermanentPostOutputModel,
  isGetCommentsInPermanentPostOutputModel,
} from '@core/domain/comment/use-case/output_model/get_comments_in_permanent_post.output_model';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';

export class GetCommentsInPermanentPostService implements GetCommentsInPermanentPostInteractor {
  constructor(@Inject(CommentDITokens.CommentRepository) private readonly gateway: GetCommentInPermanentPostGateway) {
  }

  async execute(input: GetCommentsInPermanentPostInputModel): Promise<Array<CreateCommentInPermanentPostOutputModel> | Array<GetCommentsInPermanentPostOutputModel>> {
    const comments = await this.gateway.findAll(input);

    if (comments.length == 0) {
      throw new ThereAreNoCommentsException();
    }

    const results = [];

    for (const comment of comments) {
      let result: CreateCommentInPermanentPostOutputModel | GetCommentsInPermanentPostOutputModel;
      if (isGetCommentsInPermanentPostOutputModel(comment)) {
        result = {
          id: comment['id'],
          comment: comment['comment'],
          timestamp: comment['timestamp'],
          email: comment['email'],
          name: comment['name'],
        };
      } else {
        result = {
          commentID: comment['id'],
          postID: comment['postID'],
          comment: comment['comment'],
          userID: comment['userID'],
          timestamp: comment['timestamp'],
        };
      }
      results.push(result);
    }

    return Promise.resolve(results);
  }
}