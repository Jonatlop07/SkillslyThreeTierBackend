import { Interactor } from '@core/common/use-case/interactor';
import UpdateEventInputModel from '../input-model/update_event.input_model';
import UpdateEventOutputModel from '../output-model/update_event.output_model';

export interface UpdateEventInteractor
  extends Interactor<
  UpdateEventInputModel,
  UpdateEventOutputModel
  > { }
