import QueryGroupInputModel from '@core/domain/group/use-case/input-model/query_group.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class QueryGroupAdapter implements QueryGroupInputModel {
  
  @Expose()
  @IsString()
  public group_id: string;

  @Expose()
  @IsString()
  public user_id: string;

  public static new(payload: QueryGroupInputModel): QueryGroupAdapter {
    return plainToClass(QueryGroupAdapter, payload);
  }
}