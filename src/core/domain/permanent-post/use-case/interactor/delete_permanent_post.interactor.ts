import { Interactor } from '@core/common/use-case/interactor';
import DeletePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/delete_permanent_post.input_model';
import DeletePermanentPostOutputModel from '@core/domain/permanent-post/use-case/output-model/delete_permanent_post.output_model';

export interface DeletePermanentPostInteractor extends Interactor<DeletePermanentPostInputModel, DeletePermanentPostOutputModel> { }
