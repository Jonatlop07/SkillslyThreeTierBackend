import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import GetProfileInputModel from '@core/domain/profile/use-case/input-model/get_profile.input_model';

@Exclude()
export class GetProfileAdapter implements GetProfileInputModel {
  @Expose()
  @IsString()
  public user_email: string;

  public static new(payload: GetProfileInputModel): GetProfileAdapter {
    return plainToClass(GetProfileAdapter, payload);
  }
}
