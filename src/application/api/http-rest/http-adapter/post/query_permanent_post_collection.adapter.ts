import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import QueryPermanentPostCollectionInputModel from '@core/domain/post/use-case/input-model/query_permanent_post_collection.input_model';

@Exclude()
export class QueryPermanentPostCollectionAdapter implements QueryPermanentPostCollectionInputModel{

  @Expose()
  @IsString()
  public user_id: string;

  @Expose()
  @IsString()
  public owner_id: string;

  @Expose()
  @IsString()
  public group_id: string;

  @Expose()
  public limit?: string;

  @Expose()
  public offset?: string;

  public static new(
    payload: QueryPermanentPostCollectionInputModel,
  ): QueryPermanentPostCollectionAdapter {
    return plainToClass(QueryPermanentPostCollectionAdapter, payload);
  }
}
