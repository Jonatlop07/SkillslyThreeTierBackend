import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/create_user_follow_request.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class CreateUserFollowRequestAdapter implements CreateUserFollowRequestInputModel {
  @Expose()
  public user_id: string;

  @Expose()
  @IsString()
  public user_to_follow_id: string;

  public static new(payload: CreateUserFollowRequestInputModel): CreateUserFollowRequestAdapter {
    return plainToClass(CreateUserFollowRequestAdapter, payload);
  }
}
