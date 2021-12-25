import { Interactor } from '@core/common/use-case/interactor';
import CreateEventInputModel from '../input-model/create_event.input_model';
import CreateEventOutputModel from '../output-model/create_event.output_model';

export interface CreateEventInteractor
  extends Interactor<
  CreateEventInputModel,
  CreateEventOutputModel
  > { }
