import QueryGroupCollectionInputModel from '@core/domain/group/use-case/input-model/query_group_collection.input_model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class QueryGroupCollectionAdapter implements QueryGroupCollectionInputModel {

  @Expose()
  @IsString()
  public user_id: string;
  
  @Expose()
  @IsString()
  public name: string;
  
  @Expose()
  @IsString()
  public category: string;

  @Expose()
  public limit: string;

  @Expose()
  public offset: string;

  public static new(payload: QueryGroupCollectionInputModel): QueryGroupCollectionAdapter {
    return plainToClass(QueryGroupCollectionAdapter, payload);
  }
}