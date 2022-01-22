import { AddCustomerDetailsInteractor } from '@core/domain/user/use-case/interactor/add_customer_details.interactor';
import AddCustomerDetailsInputModel from '@core/domain/user/use-case/input-model/add_customer_details.input_model';
import AddCustomerDetailsOutputModel from '@core/domain/user/use-case/output-model/add_customer_details.output_model';
import { Inject } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { AddCustomerDetailsGateway } from '@core/domain/user/use-case/gateway/add_customer_details.gateway';

export class AddCustomerDetailsService implements AddCustomerDetailsInteractor {
  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly gateway: AddCustomerDetailsGateway
  ) {
  }

  public async execute(input: AddCustomerDetailsInputModel): Promise<AddCustomerDetailsOutputModel> {
    const { user_id, customer_id } = input;
    await this.gateway.addCustomerDetails({ user_id, customer_id });
    return {};
  }
}
