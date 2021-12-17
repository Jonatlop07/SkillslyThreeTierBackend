import DeleteUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/delete_user_follow_request.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class DeleteUserFollowRequestAdapter implements DeleteUserFollowRequestInputModel {
  @Expose()
  public user_id: string;

  @Expose()
  @IsString()
  public user_to_follow_id: string;

  @Expose()
  @IsString()
  public is_request: boolean;

  public static new(payload: DeleteUserFollowRequestInputModel): DeleteUserFollowRequestAdapter {
    return plainToClass(DeleteUserFollowRequestAdapter, payload);
  }
}
