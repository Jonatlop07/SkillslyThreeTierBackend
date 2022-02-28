import { Interactor } from '@core/common/use-case/interactor';
import UpdateProjectInputModel from '@core/domain/project/use-case/input-model/update_project.input_model';
import { UpdateProjectOutputModel } from '@core/domain/project/use-case/output-model/update_project.output_model';

export interface UpdateProjectInteractor extends Interactor<UpdateProjectInputModel, UpdateProjectOutputModel> {
}
