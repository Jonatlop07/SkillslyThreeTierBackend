import { Interactor } from '@core/common/use-case/interactor';
import LeaveGroupInputModel from '../input-model/leave_group.input_model';
import LeaveGroupOutputModel from '../output-model/leave_group.output_model';

export interface LeaveGroupInteractor
  extends Interactor<
  LeaveGroupInputModel,
  LeaveGroupOutputModel
  > { }
