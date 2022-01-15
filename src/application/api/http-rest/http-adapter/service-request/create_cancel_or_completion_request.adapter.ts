import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import CreateServiceStatusUpdateRequestInputModel from '@core/domain/service-request/use-case/input-model/request_cancel_or_completion.input_model';

@Exclude()
export class CreateServiceStatusUpdateRequestAdapter implements CreateServiceStatusUpdateRequestInputModel{
  
  @Expose()
  @IsString()
    service_request_id: string;

  @Expose()
  @IsString()
    provider_id: string;

  @Expose()
  @IsString()
    update_request_action: string;
  

  public static new(payload: CreateServiceStatusUpdateRequestInputModel): CreateServiceStatusUpdateRequestAdapter {
    return plainToClass(CreateServiceStatusUpdateRequestAdapter, payload);
  }
}