import { UpdateUserAccountDTO } from '@application/api/http-rest/http-dto/user/http_update_user_account.dto';
import UpdateUserAccountOutputModel from '@core/domain/user/use-case/output-model/update_user_account.output_model';
import { UpdateUserAccountResponseDTO } from '@application/api/http-rest/http-dto/user/http_update_user_account_response.dto';
import UpdateUserAccountInputModel from '@core/domain/user/use-case/input-model/update_user_account.input_model';

export class UpdateUserAccountAdapter {
  public static toInputModel(id: string, payload: UpdateUserAccountDTO): UpdateUserAccountInputModel {
    return {
      id,
      email: payload.email,
      password: payload.password,
      name: payload.name,
      date_of_birth: payload.date_of_birth,
      is_two_factor_auth_enabled: payload.is_two_factor_auth_enabled
    };
  }

  public static toResponseDTO(payload: UpdateUserAccountOutputModel): UpdateUserAccountResponseDTO {
    return {
      email: payload.email,
      name: payload.name,
      date_of_birth: payload.date_of_birth,
      is_two_factor_auth_enabled: payload.is_two_factor_auth_enabled
    };
  }
}
