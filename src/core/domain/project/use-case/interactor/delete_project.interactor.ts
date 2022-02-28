import { Interactor } from '@core/common/use-case/interactor';
import DeleteProjectInputModel from '@core/domain/project/use-case/input-model/delete_project.input_model';
import DeleteProjectOutputModel from '@core/domain/project/use-case/output-model/delete_project.output_model';

export interface DeleteProjectInteractor extends Interactor<DeleteProjectInputModel, DeleteProjectOutputModel> {
}
