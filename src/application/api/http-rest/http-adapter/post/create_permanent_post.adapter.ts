import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import CreatePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/create_permanent_post.input_model';
import { PermanentPostContentElement } from '@core/domain/permanent-post/entity/type/permanent_post_content_element';

@Exclude()
export class CreatePermanentPostAdapter implements CreatePermanentPostInputModel{
  @Expose()
  @IsArray()
  public content: Array<PermanentPostContentElement>;

  @Expose()
  @IsString()
  public owner_id: string;

  @Expose()
  @IsString()
  public privacy: string;

  @Expose()
  @IsString()
  public group_id?: string;

  public static new(payload: CreatePermanentPostInputModel): CreatePermanentPostAdapter {
    return plainToClass(CreatePermanentPostAdapter, payload);
  }
}
