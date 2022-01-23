import CreateCustomerPaymentGateway from '@core/domain/payment/use-case/gateway/create_payment_customer.gateway';
import ObtainSpecialRolesPaymentGateway from '@core/domain/user/use-case/gateway/obtain_special_roles_payment.gateway';

export interface PaymentRepository extends CreateCustomerPaymentGateway, ObtainSpecialRolesPaymentGateway {}
