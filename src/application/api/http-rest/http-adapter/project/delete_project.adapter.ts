import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import DeleteProjectInputModel from '@core/domain/project/use-case/input-model/delete_project.input_model';


@Exclude()
export class DeleteProjectAdapter implements DeleteProjectInputModel {
  @Expose()
  @IsString()
  public project_id: string;

  public static new(payload: DeleteProjectInputModel): DeleteProjectInputModel {
    return plainToClass(DeleteProjectAdapter, payload);
  }
}
