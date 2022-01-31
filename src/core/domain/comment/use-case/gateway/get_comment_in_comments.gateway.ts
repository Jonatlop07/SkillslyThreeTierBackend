import Find from '@core/common/persistence/find';
import GetCommentsInCommentInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_comment.input_model';
import { GetCommentsInCommentOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_comment.output_model';

export default interface GetCommentsInCommentGateway extends Find<GetCommentsInCommentOutputModel, undefined | GetCommentsInCommentInputModel> {
}