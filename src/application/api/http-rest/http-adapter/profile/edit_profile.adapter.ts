import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import EditProfileInputModel from '@core/domain/profile/use-case/input-model/edit_profile.input_model';

@Exclude()
export class EditProfileAdapter implements Partial<EditProfileInputModel> {
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
  public user_id: string;

  public static new(payload: Partial<EditProfileInputModel>): EditProfileAdapter {
    return plainToClass(EditProfileAdapter, payload);
  }
}
