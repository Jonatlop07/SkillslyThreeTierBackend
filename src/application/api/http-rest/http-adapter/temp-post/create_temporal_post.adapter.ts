import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import CreateTemporalPostInputModel from '@core/domain/temp-post/use-case/input-model/create_temporal_post.input_model';

@Exclude()
export class CreateTemporalPostAdapter {
  @Expose()
  @IsString()
  public description?: string;

  @Expose()
  @IsString()
  public reference: string;

  @Expose()
  @IsString()
  public referenceType: string;

  @Expose()
  @IsString()
  public user_id: string;


  public static new(payload: CreateTemporalPostInputModel): CreateTemporalPostAdapter {
    return plainToClass(CreateTemporalPostAdapter, payload);
  }
}