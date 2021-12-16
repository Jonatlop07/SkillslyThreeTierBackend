import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import CreateGroupInputModel from '@core/domain/group/use-case/input-model/create_group.input_model';

@Exclude()
export class CreateGroupAdapter implements CreateGroupInputModel {

  @Expose()
  @IsString()
  public owner_id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @IsString()
  public category: string;
  
  @Expose()
  @IsString()
  public picture?: string;

  public static new(payload: CreateGroupInputModel): CreateGroupAdapter {
    return plainToClass(CreateGroupAdapter, payload);
  }
}
