import ObtainSpecialRolesInputModel from '@core/domain/user/use-case/input-model/obtain_special_roles.input_model';
import { HttpUserPayload } from '@application/api/http-rest/authentication/types/http_authentication_types';
import { ObtainSpecialRolesDTO } from '@application/api/http-rest/http-dto/user/http_obtain_special_roles.dto';

export class ObtainSpecialRolesAdapter {
  public static toInputModel(user_payload: HttpUserPayload, input_payload: ObtainSpecialRolesDTO): ObtainSpecialRolesInputModel {
    return {
      user_id: user_payload.id,
      customer_id: user_payload.customer_id,
      current_roles: user_payload.roles,
      obtain_investor_role: input_payload.obtain_investor_role,
      obtain_requester_role: input_payload.obtain_requester_role,
      payment_method_id: input_payload.payment_method_id
    };
  }
}
