import UpdateServiceStatusUpdateRequestInputModel from '@core/domain/service-request/use-case/input-model/update_service_status_update_request_action';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class UpdateServiceStatusUpdateRequestAdapter implements UpdateServiceStatusUpdateRequestInputModel{
  
  @Expose()
  @IsString()
    service_request_id: string;

  @Expose()
  @IsString()
    provider_id: string;

  @Expose()
  @IsString()
    requester_id: string;

  @Expose()
  @IsString()
    update_service_status_update_request_action: string;
  

  public static new(payload: UpdateServiceStatusUpdateRequestInputModel): UpdateServiceStatusUpdateRequestAdapter {
    return plainToClass(UpdateServiceStatusUpdateRequestAdapter, payload);
  }
}