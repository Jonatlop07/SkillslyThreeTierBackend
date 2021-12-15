import { Interactor } from '@core/common/use-case/interactor';
import CreateProjectInputModel from '@core/domain/project/use-case/input-model/create_project.input_model';
import CreateProjectOutputModel from '@core/domain/project/use-case/output-model/create_project.output_model';

export interface CreateProjectInteractor
  extends Interactor<CreateProjectInputModel, CreateProjectOutputModel> {}
