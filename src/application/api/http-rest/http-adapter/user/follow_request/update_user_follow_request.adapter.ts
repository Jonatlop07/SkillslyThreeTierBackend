import UpdateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/update_user_follow_request.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class UpdateUserFollowRequestAdapter implements UpdateUserFollowRequestInputModel {
  @Expose()
  public user_id: string;

  @Expose()
  @IsString()
  public user_that_requests_id: string;

  @Expose()
  @IsString()
  public accept: boolean;

  public static new(payload: UpdateUserFollowRequestInputModel): UpdateUserFollowRequestAdapter {
    return plainToClass(UpdateUserFollowRequestAdapter, payload);
  }
}
