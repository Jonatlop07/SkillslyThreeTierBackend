import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';

@Exclude()
export class CreateUserAccountAdapter implements CreateUserAccountInputModel {

  @Expose()
  @IsEmail()
  public email: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public password: string;

  @Expose()
  @IsString()
  public date_of_birth: string;

  public static new(payload: CreateUserAccountInputModel): CreateUserAccountAdapter {
    return plainToClass(CreateUserAccountAdapter, payload);
  }
}
