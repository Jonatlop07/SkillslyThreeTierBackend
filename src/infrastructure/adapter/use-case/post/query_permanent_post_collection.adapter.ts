import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import QueryPermanentPostCollectionInputModel from '@core/domain/post/input-model/query_permanent_post_collection.input_model';

@Exclude()
export class QueryPermanentPostCollectionAdapter implements QueryPermanentPostCollectionInputModel{

  @Expose()
  @IsString()
  public user_id: string;

  public static new(
    payload: QueryPermanentPostCollectionInputModel,
  ): QueryPermanentPostCollectionAdapter {
    return plainToClass(QueryPermanentPostCollectionAdapter, payload);
  }
}
