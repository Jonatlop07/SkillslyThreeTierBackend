import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import QueryProjectInputModel from '@core/domain/project/use-case/input-model/query_project_collection.input_model';

@Exclude()
export class QueryProjectCollectionAdapter implements QueryProjectInputModel {
  @Expose()
  @IsString()
  public owner_id: string;

  public static new(
    payload: QueryProjectInputModel
  ): QueryProjectCollectionAdapter {
    return plainToClass(QueryProjectCollectionAdapter, payload);
  }
}
