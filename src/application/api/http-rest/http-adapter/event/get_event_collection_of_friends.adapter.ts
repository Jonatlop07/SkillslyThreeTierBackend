
import GetEventCollectionOfFriendsInputModel from '@core/domain/event/use-case/input-model/get_event_collection_of_friends.input_model';
import { Expose, plainToClass } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetEventOfFriendsCollectionAdapter implements GetEventCollectionOfFriendsInputModel {
  @Expose()
  public user_id: string;

  @Expose()
  @IsNumber()
  public limit: number;

  @Expose()
  @IsNumber()
  public offset: number;

  public static new(payload: GetEventCollectionOfFriendsInputModel): GetEventOfFriendsCollectionAdapter {
    return plainToClass(GetEventOfFriendsCollectionAdapter, payload);
  }
}
