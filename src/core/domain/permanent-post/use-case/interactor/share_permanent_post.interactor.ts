import { Interactor } from '@core/common/use-case/interactor';
import SharePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/share_permanent_post.input_model';
import SharePermanentPostOutputModel from '@core/domain/permanent-post/use-case/output-model/share_permanent_post.output_model';
export interface SharePermanentPostInteractor
  extends Interactor<SharePermanentPostInputModel, SharePermanentPostOutputModel> {}
