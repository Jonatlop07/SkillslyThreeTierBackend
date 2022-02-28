import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import CreateProjectInputModel from '@core/domain/project/use-case/input-model/create_project.input_model';

@Exclude()
export class CreateProjectAdapter implements CreateProjectInputModel {
  @Expose()
  @IsArray()
  title: string;

  @Expose()
  @IsArray()
  members: Array<string>;

  @Expose()
  @IsArray()
  description: string;

  @Expose()
  @IsArray()
  reference: string;

  @Expose()
  @IsArray()
  reference_type: string;

  @Expose()
  @IsArray()
  annexes: Array<string>;

  @Expose()
  @IsString()
  public owner_id: string;

  public static new(payload: CreateProjectInputModel): CreateProjectAdapter {
    return plainToClass(CreateProjectAdapter, payload);
  }
}
