import { Exclude, Expose, plainToClass } from 'class-transformer';
import CreateCommentInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_permanent_post.input_model';
import { IsString } from 'class-validator';

@Exclude()
export class CreateCommentInPermanentPostAdapter implements CreateCommentInPermanentPostInputModel {
  @Expose()
  @IsString()
  public comment: string;
  @Expose()
  @IsString()
  public timestamp: string;
  @Expose()
  @IsString()
  public owner_id: string;
  @Expose()
  @IsString()
  public post_id: string;

  public static new(payload: CreateCommentInPermanentPostInputModel): CreateCommentInPermanentPostAdapter {
    return plainToClass(CreateCommentInPermanentPostAdapter, payload);
  }
}
