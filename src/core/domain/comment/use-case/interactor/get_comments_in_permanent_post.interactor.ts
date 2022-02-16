import { Interactor } from '@core/common/use-case/interactor';
import GetCommentsInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/get_comments_in_permanent_post.input_model';
import { GetCommentsInPermanentPostOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_permanent_post.output_model';

export interface GetCommentsInPermanentPostInteractor extends
  Interactor <GetCommentsInPermanentPostInputModel, GetCommentsInPermanentPostOutputModel>{
}
