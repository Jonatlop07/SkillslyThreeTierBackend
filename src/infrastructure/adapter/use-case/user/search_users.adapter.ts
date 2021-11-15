import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import SearchUsersInputModel from '@core/domain/user/use-case/input-model/search_users.input_model';

@Exclude()
export class SearchUsersAdapter implements SearchUsersInputModel {
  @Expose()
  @IsEmail()
  public email: string;

  @Expose()
  @IsString()
  public name: string;

  public static new(payload: SearchUsersInputModel): SearchUsersAdapter {
    return plainToClass(SearchUsersAdapter, payload);
  }
}
