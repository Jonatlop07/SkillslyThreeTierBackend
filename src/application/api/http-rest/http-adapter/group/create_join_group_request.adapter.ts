import CreateJoinGroupRequestInputModel from '@core/domain/group/use-case/input-model/join-request/create_join_group_request.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class CreateJoinGroupRequestAdapter implements CreateJoinGroupRequestInputModel {
  
  @Expose()
  @IsString()
  public group_id: string;

  @Expose()
  public user_id: string;

  public static new(payload: CreateJoinGroupRequestInputModel): CreateJoinGroupRequestAdapter {
    return plainToClass(CreateJoinGroupRequestAdapter, payload);
  }
}