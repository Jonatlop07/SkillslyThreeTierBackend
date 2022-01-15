import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import UpdateServiceRequestApplicationInputModel from '@core/domain/service-request/use-case/input-model/service-request-applications/update_application.input_model';

@Exclude()
export class UpdateServiceRequestApplicationAdapter implements UpdateServiceRequestApplicationInputModel{
  
  @Expose()
  @IsString()
    applicant_id: string;

  @Expose()
  @IsString()
    request_id: string;

  @Expose()
  @IsString()
    user_id: string;

  @Expose()
  @IsString()
    application_action: string;

  public static new(payload: UpdateServiceRequestApplicationInputModel): UpdateServiceRequestApplicationAdapter {
    return plainToClass(UpdateServiceRequestApplicationAdapter, payload);
  }
}