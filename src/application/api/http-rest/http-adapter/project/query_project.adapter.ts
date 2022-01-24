import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import QueryProjectInputModel from "@core/domain/project/use-case/input-model/query_project.input_model";

@Exclude()
export class QueryProjectAdapter implements QueryProjectInputModel{
    @Expose()
    @IsString()
    public user_id: string;

    public static new(
        payload: QueryProjectInputModel,
    ): QueryProjectAdapter {
        return plainToClass(QueryProjectAdapter, payload);
    }
}