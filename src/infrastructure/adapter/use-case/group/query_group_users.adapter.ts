import QueryGroupUsersInputModel from '@core/domain/group/use-case/input-model/query_group_users.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class QueryGroupUsersAdapter implements QueryGroupUsersInputModel {
  
  @Expose()
  @IsString()
  public group_id: string;

  @Expose()
  public limit: string;

  @Expose()
  public offset: string;

  public static new(payload: QueryGroupUsersInputModel): QueryGroupUsersAdapter {
    return plainToClass(QueryGroupUsersAdapter, payload);
  }
}