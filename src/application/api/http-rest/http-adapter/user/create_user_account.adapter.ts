import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountDTO } from '@application/api/http-rest/http-dto/user/http_create_user_account.dto';
import CreateUserAccountOutputModel from '@core/domain/user/use-case/output-model/create_user_account.output_model';
import { CreateUserAccountResponseDTO } from '@application/api/http-rest/http-dto/user/http_create_user_account_response.dto';

export class CreateUserAccountAdapter {
  public static toInputModel(payload: CreateUserAccountDTO): CreateUserAccountInputModel {
    return {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      date_of_birth: payload.date_of_birth,
      is_investor: payload.is_investor,
      is_requester: payload.is_requester
    };
  }

  public static toResponseDTO(payload: CreateUserAccountOutputModel, customer_id: string): CreateUserAccountResponseDTO {
    return {
      id: payload.id,
      email: payload.email,
      customer_id
    };
  }
}
