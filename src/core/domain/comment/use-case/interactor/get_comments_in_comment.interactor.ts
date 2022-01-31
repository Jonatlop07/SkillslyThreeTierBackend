import { Interactor } from '@core/common/use-case/interactor';
import GetCommentsInCommentInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_comment.input_model';
import { GetCommentsInCommentOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_comment.output_model';

export interface GetCommentsInCommentInteractor extends Interactor<GetCommentsInCommentInputModel, Array<GetCommentsInCommentOutputModel>> {
}