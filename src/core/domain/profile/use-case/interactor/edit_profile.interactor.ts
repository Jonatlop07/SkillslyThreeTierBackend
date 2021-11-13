import CreateProfileInputModel from '@core/domain/profile/use-case/input-model/create_profile.input_model';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { Interactor } from '@core/common/use-case/interactor';

export interface EditProfileInteractor extends Interactor<Partial<CreateProfileInputModel>, CreateProfileOutputModel> {}
