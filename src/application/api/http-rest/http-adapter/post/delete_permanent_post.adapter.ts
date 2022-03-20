import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import DeletePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/delete_permanent_post.input_model';


@Exclude()
export class DeletePermanentPostAdapter implements DeletePermanentPostInputModel {
    @Expose()
    @IsString()
    public post_id: string;

    public static new(payload: DeletePermanentPostInputModel,): DeletePermanentPostInputModel {
        return plainToClass(DeletePermanentPostAdapter, payload);
    }
}
