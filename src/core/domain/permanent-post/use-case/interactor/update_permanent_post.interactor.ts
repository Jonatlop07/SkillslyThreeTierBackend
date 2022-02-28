import { Interactor } from '@core/common/use-case/interactor';
import UpdatePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/update_permanent_post.input_model';
import { UpdatePermanentPostOutputModel } from '@core/domain/permanent-post/use-case/output-model/update_permanent_post.output_model';

export interface UpdatePermanentPostInteractor extends Interactor<UpdatePermanentPostInputModel, UpdatePermanentPostOutputModel> {}
