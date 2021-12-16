import { Interactor } from '@core/common/use-case/interactor';
import DeleteGroupInputModel from '../input-model/delete_group.input_model';
import DeleteGroupOutputModel from '../output-model/delete_group.output_model';

export interface DeleteGroupInteractor
  extends Interactor<
  DeleteGroupInputModel,
  DeleteGroupOutputModel
  > { }
