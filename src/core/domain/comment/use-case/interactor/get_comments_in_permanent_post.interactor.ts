import { Interactor } from '@core/common/use-case/interactor';
import CreateCommentInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_permanent_post.input_model';
import GetCommentsInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_permanent_post.input_model';
import { GetCommentsInPermanentPostOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_permanent_post.output_model';

export interface GetCommentsInPermanentPostInteractor extends
  Interactor <undefined | GetCommentsInPermanentPostInputModel,
  Array<CreateCommentInPermanentPostInputModel> | Array<GetCommentsInPermanentPostOutputModel>> {
}