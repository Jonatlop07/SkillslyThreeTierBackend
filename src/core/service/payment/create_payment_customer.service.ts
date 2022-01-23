import CreateCustomerInputModel from '@core/domain/payment/use-case/input-model/create_payment_customer.input_model';
import CreateCustomerOutputModel from '@core/domain/payment/use-case/output-model/create_payment_customer.output_model';
import { Inject, Logger } from '@nestjs/common';
import { PaymentDITokens } from '@core/domain/payment/di/payment_di_tokens';
import CreateCustomerPaymentGateway from '@core/domain/payment/use-case/gateway/create_payment_customer.gateway';
import { CreatePaymentCustomerInteractor } from '@core/domain/payment/use-case/interactor/create_payment_customer.interactor';

export class CreatePaymentCustomerService implements CreatePaymentCustomerInteractor {
  private readonly logger: Logger = new Logger(CreatePaymentCustomerService.name);

  constructor(
    @Inject(PaymentDITokens.PaymentRepository)
    private readonly payment_gateway: CreateCustomerPaymentGateway
  ) {}


  public async execute(input: CreateCustomerInputModel): Promise<CreateCustomerOutputModel> {
    const { name, email } = input;
    return await this.payment_gateway.createCustomer({
      name,
      email
    });
  }
}
