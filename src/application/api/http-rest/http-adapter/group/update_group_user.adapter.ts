import UpdateGroupUserInputModel from '@core/domain/group/use-case/input-model/join-request/update_group_user.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class UpdateGroupUserAdapter implements UpdateGroupUserInputModel {

  @Expose()
  @IsString()
  public group_id: string;

  @Expose()
  public user_id: string;

  @Expose()
  @IsString()
  public owner_id: string;

  @Expose()
  @IsString()
  public action: string;

  public static new(payload: UpdateGroupUserInputModel): UpdateGroupUserAdapter {
    return plainToClass(UpdateGroupUserAdapter, payload);
  }
}