import { PaymentRepository } from '@core/domain/payment/use-case/repository/payment.repository';
import { NewCustomerDTO } from '@core/domain/payment/use-case/persistence-dto/new_customer.dto';
import Stripe from 'stripe';
import { CreatedCustomerDTO } from '@core/domain/payment/use-case/persistence-dto/created_customer.dto';
import { ChargeAmountDTO } from '@core/domain/payment/use-case/persistence-dto/charge_amount.dto';

export class StripePaymentRepositoryAdapter implements PaymentRepository {
  constructor(private stripe: Stripe) {
  }

  public async createCustomer(new_customer_details: NewCustomerDTO): Promise<CreatedCustomerDTO> {
    const { id: customer_id } = await this.stripe.customers.create(new_customer_details);
    return {
      customer_id
    };
  }

  public async chargeAmountToCustomer(details: ChargeAmountDTO): Promise<void> {
    const { customer_id, amount, payment_method_id } = details;
    await this.stripe.paymentIntents.create({
      amount,
      customer: customer_id,
      payment_method: payment_method_id,
      currency: 'COP',
      confirm: true
    });
  }
}
