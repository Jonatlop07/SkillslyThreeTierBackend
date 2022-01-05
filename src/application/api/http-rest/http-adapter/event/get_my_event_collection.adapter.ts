import GetMyEventCollectionInputModel from '@core/domain/event/use-case/input-model/get_my_event_collection.input_model';
import { Expose, plainToClass } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetMyEventCollectionAdapter implements GetMyEventCollectionInputModel {
  @Expose()
  public user_id: string;

  @Expose()
  @IsNumber()
  public limit: number;

  @Expose()
  @IsNumber()
  public offset: number;

  public static new(payload: GetMyEventCollectionInputModel): GetMyEventCollectionAdapter {
    return plainToClass(GetMyEventCollectionAdapter, payload);
  }
}
