import { Interactor } from '@core/common/use-case/interactor';
import CreatePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/create_permanent_post.input_model';
import CreatePermanentPostOutputModel from '@core/domain/permanent-post/use-case/output-model/create_permanent_post.output_model';

export interface CreatePermanentPostInteractor
  extends Interactor<
  CreatePermanentPostInputModel,
  CreatePermanentPostOutputModel
  > { }
