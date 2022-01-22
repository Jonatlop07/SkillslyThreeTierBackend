import { Module, Provider } from '@nestjs/common';
import { PaymentDITokens } from '@core/domain/payment/di/payment_di_tokens';
import { StripePaymentRepositoryAdapter } from '@infrastructure/adapter/payment/stripe/stripe_payment_repository.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { CreatePaymentCustomerService } from '@core/service/payment/create_payment_customer.service';

const persistence_providers: Array<Provider> = [
  {
    provide: PaymentDITokens.PaymentRepository,
    useFactory: (config_service: ConfigService) => new StripePaymentRepositoryAdapter(
      new Stripe(config_service.get('STRIPE_SECRET_KEY'), {
        apiVersion: '2020-08-27'
      })
    ),
    inject: [ConfigService]
  }
];

const use_case_providers: Array<Provider> = [
  {
    provide: PaymentDITokens.CreatePaymentCustomerInteractor,
    useFactory: (payment_gateway) => new CreatePaymentCustomerService(payment_gateway),
    inject: [PaymentDITokens.PaymentRepository]
  }
];

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    ...persistence_providers,
    ...use_case_providers
  ],
  exports: [
    PaymentDITokens.CreatePaymentCustomerInteractor,
    PaymentDITokens.PaymentRepository
  ]
})
export class PaymentModule {}
