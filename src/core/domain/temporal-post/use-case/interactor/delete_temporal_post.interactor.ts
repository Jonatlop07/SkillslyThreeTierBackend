import { Interactor } from '@core/common/use-case/interactor';
import DeleteTemporalPostInputModel from '@core/domain/temporal-post/use-case/input-model/delete_temporal_post.input_model';
import DeleteTemporalPostOutputModel
  from '@core/domain/temporal-post/use-case/output-model/delete_temporal_post.output_model';

export interface DeleteTemporalPostInteractor extends Interactor<DeleteTemporalPostInputModel, DeleteTemporalPostOutputModel> {
}
