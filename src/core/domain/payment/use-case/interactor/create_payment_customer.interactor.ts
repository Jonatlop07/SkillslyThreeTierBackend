import { Interactor } from '@core/common/use-case/interactor';
import CreatePaymentCustomerInputModel
  from '@core/domain/payment/use-case/input-model/create_payment_customer.input_model';
import CreatePaymentCustomerOutputModel
  from '@core/domain/payment/use-case/output-model/create_payment_customer.output_model';

export interface CreatePaymentCustomerInteractor extends Interactor<CreatePaymentCustomerInputModel, CreatePaymentCustomerOutputModel> {}
