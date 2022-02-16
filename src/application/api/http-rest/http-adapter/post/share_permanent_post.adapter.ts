import SharePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/share_permanent_post.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class SharePermanentPostAdapter implements SharePermanentPostInputModel{
  @Expose()
  @IsString()
  public post_id: string;

  @Expose()
  @IsString()
  public user_id: string;

  public static new(payload: SharePermanentPostInputModel,): SharePermanentPostAdapter {
    return plainToClass(SharePermanentPostAdapter, payload);
  }
}
