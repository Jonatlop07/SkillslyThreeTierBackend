import { Interactor } from '@core/common/use-case/interactor';
import AddCustomerDetailsInputModel from '@core/domain/user/use-case/input-model/add_customer_details.input_model';
import AddCustomerDetailsOutputModel from '@core/domain/user/use-case/output-model/add_customer_details.output_model';

export interface AddCustomerDetailsInteractor extends Interactor<AddCustomerDetailsInputModel, AddCustomerDetailsOutputModel> {}
