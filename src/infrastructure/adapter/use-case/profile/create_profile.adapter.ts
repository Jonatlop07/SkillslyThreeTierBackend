import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import CreateProfileInputModel from '@core/domain/profile/use-case/input-model/create_profile.input_model';

@Exclude()
export class CreateProfileAdapter implements CreateProfileInputModel {
  @Expose()
  @IsString()
  public resume: string;

  @Expose()
  @IsArray()
  public knowledge: Array<string>;

  @Expose()
  @IsArray()
  public talents: Array<string>;

  @Expose()
  @IsArray()
  public activities: Array<string>;

  @Expose()
  @IsString()
  public interests: Array<string>;

  @Expose()
  @IsString()
  public user_email: string;

  public static new(payload: CreateProfileInputModel): CreateProfileAdapter {
    return plainToClass(CreateProfileAdapter, payload);
  }
}
