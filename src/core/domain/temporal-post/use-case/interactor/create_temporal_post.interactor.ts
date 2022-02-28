import { Interactor } from '@core/common/use-case/interactor';
import CreateTemporalPostInputModel from '@core/domain/temporal-post/use-case/input-model/create_temporal_post.input_model';
import CreateTemporalPostOutputModel
  from '@core/domain/temporal-post/use-case/output-model/create_temporal_post.output_model';

export interface CreateTemporalPostInteractor extends Interactor<CreateTemporalPostInputModel, CreateTemporalPostOutputModel> {
}
