import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import CreateServiceRequestApplicationInputModel from '@core/domain/service-request/use-case/input-model/service-request-applications/create_application.input_model';

@Exclude()
export class CreateServiceRequestApplicationAdapter implements CreateServiceRequestApplicationInputModel{

  @Expose()
  @IsString()
    applicant_id: string;

  @Expose()
  @IsString()
    request_id: string;

  @Expose()
  @IsString()
    message: string;

  public static new(payload: CreateServiceRequestApplicationInputModel): CreateServiceRequestApplicationAdapter {
    return plainToClass(CreateServiceRequestApplicationAdapter, payload);
  }
}