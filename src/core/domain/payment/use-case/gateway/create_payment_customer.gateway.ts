import { NewCustomerDTO } from '@core/domain/payment/use-case/persistence-dto/new_customer.dto';
import { CreatedCustomerDTO } from '@core/domain/payment/use-case/persistence-dto/created_customer.dto';

export default interface CreatePaymentCustomerGateway {
  createCustomer(new_customer_details: NewCustomerDTO): Promise<CreatedCustomerDTO>;
}
