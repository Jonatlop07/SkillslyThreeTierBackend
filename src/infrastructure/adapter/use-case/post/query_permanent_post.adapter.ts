import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import QueryPermanentPostInputModel from '@core/domain/post/use-case/input-model/query_permanent_post.input_model';

@Exclude()
export class QueryPermanentPostAdapter implements QueryPermanentPostInputModel{
  @Expose()
  @IsString()
  public user_id: string;

  @Expose()
  @IsString()
  public id: string;

  public static new(
    payload: QueryPermanentPostInputModel,
  ): QueryPermanentPostAdapter {
    return plainToClass(QueryPermanentPostAdapter, payload);
  }
}
