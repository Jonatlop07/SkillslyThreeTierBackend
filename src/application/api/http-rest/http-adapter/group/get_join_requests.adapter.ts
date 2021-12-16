import GetJoinRequestsInputModel from '@core/domain/group/use-case/input-model/join-request/get_join_requests.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class GetJoinRequestsAdapter implements GetJoinRequestsInputModel {
  
  @Expose()
  @IsString()
  public group_id: string;

  @Expose()
  public limit: string;

  @Expose()
  public offset: string;

  public static new(payload: GetJoinRequestsInputModel): GetJoinRequestsAdapter {
    return plainToClass(GetJoinRequestsAdapter, payload);
  }
}