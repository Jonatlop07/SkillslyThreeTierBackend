import CreateCommentInCommentInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_comment.input_model';
import CreateCommentInCommentOutputModel
  from '@core/domain/comment/use-case/output_model/create_comment_in_comment.output_model';
import { Interactor } from '@core/common/use-case/interactor';


export interface CreateCommentInCommentInteractor extends Interactor<CreateCommentInCommentInputModel, CreateCommentInCommentOutputModel> {
}