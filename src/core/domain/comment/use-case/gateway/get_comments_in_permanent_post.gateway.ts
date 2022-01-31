import GetCommentsInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_permanent_post.input_model';
import Find from '@core/common/persistence/find';
import { GetCommentsInPermanentPostOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_permanent_post.output_model';

export default interface GetCommentInPermanentPostGateway extends Find<GetCommentsInPermanentPostOutputModel, undefined | GetCommentsInPermanentPostInputModel> {
}