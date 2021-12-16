import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import QueryTemporalPostCollectionInputModel
  from '@core/domain/temp-post/use-case/input-model/query_temporal_post_collection.input_model';

@Exclude()
export class QueryTemporalPostCollectionAdapter {
  @Expose()
  @IsString()
  public user_id: string;

  public static new(payload: QueryTemporalPostCollectionInputModel): QueryTemporalPostCollectionAdapter {
    return plainToClass(QueryTemporalPostCollectionAdapter, payload);
  }
}