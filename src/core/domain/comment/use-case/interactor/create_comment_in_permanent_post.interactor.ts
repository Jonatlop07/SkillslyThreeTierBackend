import { Interactor } from '@core/common/use-case/interactor';
import CreateCommentInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_permanent_post.input_model';
import CreateCommentInPermanentPostOutputModel
  from '@core/domain/comment/use-case/output_model/create_comment_in_permanent_post.output_model';

export interface CreateCommentInPermanentPostInteractor extends Interactor<CreateCommentInPermanentPostInputModel, CreateCommentInPermanentPostOutputModel> {
}