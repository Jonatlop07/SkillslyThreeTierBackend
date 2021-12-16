import GetUserFollowRequestCollectionInputModel from '@core/domain/user/use-case/input-model/follow_request/get_user_follow_request_collection.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class GetUserFollowRequestCollectionAdapter implements GetUserFollowRequestCollectionInputModel {
  @Expose()
  public user_id: string;

  public static new(payload: GetUserFollowRequestCollectionInputModel): GetUserFollowRequestCollectionAdapter {
    return plainToClass(GetUserFollowRequestCollectionAdapter, payload);
  }
}