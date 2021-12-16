import { Interactor } from '@core/common/use-case/interactor';
import CreateGroupInputModel from '../input-model/create_group.input_model';
import CreateGroupOutputModel from '../output-model/create_group.output_model';

export interface CreateGroupInteractor
  extends Interactor<
  CreateGroupInputModel,
  CreateGroupOutputModel
  > { }
