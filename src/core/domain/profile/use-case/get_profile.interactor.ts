import { Interactor } from '@core/common/use-case/interactor';
import GetProfileInputModel from '@core/domain/profile/input-model/get_profile.input_model';
import GetProfileOutputModel from '@core/domain/profile/use-case/output-model/get_profile.output_model';

export interface GetProfileInteractor extends Interactor<GetProfileInputModel, GetProfileOutputModel> {
}
