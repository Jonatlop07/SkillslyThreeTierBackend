import { Interactor } from '@core/common/use-case/interactor';
import UpdateGroupInputModel from '../input-model/update_group.input_model';
import UpdateGroupOutputModel from '../output-model/update_group.output_model';

export interface UpdateGroupInteractor
  extends Interactor<
  UpdateGroupInputModel,
  UpdateGroupOutputModel
  > { }
