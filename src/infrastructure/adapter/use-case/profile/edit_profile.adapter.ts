import CreateProfileInputModel from '@core/domain/profile/input-model/create_profile.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

@Exclude()
export class EditProfileAdapter implements Partial<CreateProfileInputModel> {
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
  public userEmail: string;


  public static new(payload: Partial<CreateProfileInputModel>): EditProfileAdapter {
    return plainToClass(EditProfileAdapter, payload);
  }
}