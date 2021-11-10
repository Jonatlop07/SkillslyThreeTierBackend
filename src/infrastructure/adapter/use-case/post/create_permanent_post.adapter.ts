import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import CreatePermanentPostInputModel from '@core/domain/post/input-model/create_permanent_post.input_model';
import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_post_content_element';

@Exclude()
export class CreatePermanentPostAdapter implements CreatePermanentPostInputModel{

  @Expose()
  @IsArray()
  public content: PermanentPostContentElement[];

  @Expose()
  @IsString()
  public user_id: string;

  public static new(
    payload: CreatePermanentPostInputModel,
  ): CreatePermanentPostAdapter {
    return plainToClass(CreatePermanentPostAdapter, payload);
  }
}
