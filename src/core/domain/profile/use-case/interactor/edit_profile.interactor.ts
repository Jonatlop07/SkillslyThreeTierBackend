import { Interactor } from '@core/common/use-case/interactor';
import EditProfileInputModel from '@core/domain/profile/use-case/input-model/edit_profile.input_model';
import EditProfileOutputModel from '@core/domain/profile/use-case/output-model/edit_profile.output_model';

export interface EditProfileInteractor extends Interactor<Partial<EditProfileInputModel>, EditProfileOutputModel> {}
