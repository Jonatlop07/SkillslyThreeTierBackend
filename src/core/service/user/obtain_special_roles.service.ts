import { ObtainSpecialRolesInteractor } from '@core/domain/user/use-case/interactor/obtain_special_roles.interactor';
import { Inject, Logger } from '@nestjs/common';
import { PaymentDITokens } from '@core/domain/payment/di/payment_di_tokens';
import ObtainSpecialRolesPaymentGateway from '@core/domain/user/use-case/gateway/obtain_special_roles_payment.gateway';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import ObtainSpecialRolesPersistenceGateway
  from '@core/domain/user/use-case/gateway/obtain_special_roles_persistence.gateway';
import ObtainSpecialRolesInputModel from '@core/domain/user/use-case/input-model/obtain_special_roles.input_model';
import ObtainSpecialRolesOutputModel from '@core/domain/user/use-case/output-model/obtain_special_roles.output_model';
import { Role } from '@core/domain/user/entity/type/role.enum';
import {
  NoSpecialRoleToObtainException, UserAlreadyHasInvestorRoleException, UserAlreadyHasRequesterRoleException,
  UserAlreadyHasSpecialRolesException
} from '@core/domain/user/use-case/exception/user_account.exception';

export class ObtainSpecialRolesService implements ObtainSpecialRolesInteractor {
  private readonly logger: Logger = new Logger(ObtainSpecialRolesService.name);

  constructor(
    @Inject(PaymentDITokens.PaymentRepository)
    private readonly payment_gateway: ObtainSpecialRolesPaymentGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly persistence_gateway: ObtainSpecialRolesPersistenceGateway
  ) {}

  public async execute(input: ObtainSpecialRolesInputModel): Promise<ObtainSpecialRolesOutputModel> {
    const SINGLE_ROLE_ACQUISITION_PRICE = 5000;
    const {
      user_id, customer_id, current_roles,
      obtain_investor_role, obtain_requester_role,
      payment_method_id
    } = input;
    if (!obtain_investor_role && !obtain_requester_role)
      throw new NoSpecialRoleToObtainException();
    const already_requester = current_roles.includes(Role.Requester) && obtain_requester_role;
    const already_investor = current_roles.includes(Role.Investor) && obtain_investor_role;
    if (already_requester && already_investor)
      throw new UserAlreadyHasSpecialRolesException();
    if (already_requester)
      throw new UserAlreadyHasRequesterRoleException();
    if (already_investor)
      throw new UserAlreadyHasInvestorRoleException();
    const number_of_roles_to_pay: number = obtain_investor_role && obtain_requester_role ? 2 : 1;
    const amount_to_pay: number = SINGLE_ROLE_ACQUISITION_PRICE * number_of_roles_to_pay;
    await this.payment_gateway.chargeAmountToCustomer({
      payment_method_id,
      customer_id,
      amount: amount_to_pay
    });
    const roles: Array<Role> = await this.persistence_gateway.updateUserRoles({
      user_id,
      investor: obtain_investor_role,
      requester: obtain_requester_role
    });
    return {
      roles
    };
  }
}
