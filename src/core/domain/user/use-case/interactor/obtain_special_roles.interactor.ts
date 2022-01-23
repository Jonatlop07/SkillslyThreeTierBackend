import { Interactor } from '@core/common/use-case/interactor';
import ObtainSpecialRolesInputModel from '@core/domain/user/use-case/input-model/obtain_special_roles.input_model';
import ObtainSpecialRolesOutputModel from '@core/domain/user/use-case/output-model/obtain_special_roles.output_model';

export interface ObtainSpecialRolesInteractor extends Interactor<ObtainSpecialRolesInputModel, ObtainSpecialRolesOutputModel> {}
