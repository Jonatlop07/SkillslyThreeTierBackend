import { UpdateUserAccountDTO } from '@application/api/http-rest/http-dto/user/http_update_user_account.dto';
import UpdateUserAccountOutputModel from '@core/domain/user/use-case/output-model/update_user_account.output_model';
import { UpdateUserAccountResponseDTO } from '@application/api/http-rest/http-dto/user/http_update_user_account_response.dto';

export class UpdateUserAccountAdapter {
  public static toInputModel(id: string, payload: UpdateUserAccountDTO) {
    return {
      id,
      email: payload.email,
      password: payload.password,
      name: payload.name,
      date_of_birth: payload.date_of_birth
    };
  }

  public static toResponseDTO(payload: UpdateUserAccountOutputModel): UpdateUserAccountResponseDTO {
    return {
      email: payload.email,
      name: payload.name,
      date_of_birth: payload.date_of_birth
    };
  }
}
