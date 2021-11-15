import { Interactor } from '@core/common/use-case/interactor';
import CreateProfileInputModel from '@core/domain/profile/use-case/input-model/create_profile.input_model';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';

export interface CreateProfileInteractor extends Interactor<CreateProfileInputModel, CreateProfileOutputModel> {}
