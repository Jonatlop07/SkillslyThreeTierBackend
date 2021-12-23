import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountDTO } from '@application/api/http-rest/http-dto/user/http_create_user_account.dto';

export class CreateUserAccountAdapter {
  public static toInputModel(payload: CreateUserAccountDTO): CreateUserAccountInputModel {
    return {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      date_of_birth: payload.date_of_birth,
      is_investor: payload.is_investor
    };
  }
}
