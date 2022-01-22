import { ChargeAmountDTO } from '@core/domain/payment/use-case/persistence-dto/charge_amount.dto';

export interface Charge {
  chargeAmountToCustomer(details: ChargeAmountDTO): Promise<void>;
}
