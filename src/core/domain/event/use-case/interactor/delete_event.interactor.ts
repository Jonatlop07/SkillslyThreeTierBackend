import { Interactor } from '@core/common/use-case/interactor';
import DeleteEventInputModel from '../input-model/delete_event.input_model';
import DeleteEventOutputModel from '../output-model/delete_event.output_model';

export interface DeleteEventInteractor
  extends Interactor<
  DeleteEventInputModel,
  DeleteEventOutputModel
  > { }
