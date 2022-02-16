import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

import QueryTemporalPostInputModel from '@core/domain/temporal-post/use-case/input-model/query_temporal_post.input_model';

@Exclude()
export class DeleteTemporalPostAdapter {
  @Expose()
  @IsString()
  public temporal_post_id: string;
  @Expose()
  @IsString()
  public user_id: string;

  public static new(payload: QueryTemporalPostInputModel): DeleteTemporalPostAdapter {
    return plainToClass(DeleteTemporalPostAdapter, payload);
  }
}
