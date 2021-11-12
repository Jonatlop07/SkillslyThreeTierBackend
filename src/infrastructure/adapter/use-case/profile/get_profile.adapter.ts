import GetProfileInputModel from '@core/domain/profile/input-model/get_profile.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class GetProfileAdapter implements GetProfileInputModel {
  @Expose()
  @IsString()
  public userEmail: string;

  public static new(payload: GetProfileInputModel): GetProfileAdapter {
    return plainToClass(GetProfileAdapter, payload);
  }
}