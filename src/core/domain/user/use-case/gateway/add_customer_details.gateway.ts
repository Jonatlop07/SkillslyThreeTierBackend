import { AddCustomerDetailsDTO } from '@core/domain/user/use-case/persistence-dto/add_customer_details.dto';

export interface AddCustomerDetailsGateway {
  addCustomerDetails(customer_details: AddCustomerDetailsDTO): Promise<string>;
}
