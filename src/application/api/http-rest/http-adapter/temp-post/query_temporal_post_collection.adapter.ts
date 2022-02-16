import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import QueryTemporalPostCollectionInputModel
  from '@core/domain/temporal-post/use-case/input-model/query_temporal_post_collection.input_model';

@Exclude()
export class QueryTemporalPostCollectionAdapter {
  @Expose()
  @IsString()
  public owner_id: string;

  public static new(payload: QueryTemporalPostCollectionInputModel): QueryTemporalPostCollectionAdapter {
    return plainToClass(QueryTemporalPostCollectionAdapter, payload);
  }
}
