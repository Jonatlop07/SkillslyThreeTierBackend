import { Inject, Injectable, Logger } from '@nestjs/common';
import { DeletePermanentPostInteractor } from '@core/domain/post/use-case/interactor/delete_permanent_post.interactor';
import DeletePermanentPostInputModel from '@core/domain/post/use-case/input-model/delete_permanent_post.input_model';
import DeletePermanentPostOutputModel from '@core/domain/post/use-case/output-model/delete_permanent_post.output_model';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import DeletePermanentPostGateway from '@core/domain/user/use-case/gateway/delete_user_account.gateway';
import { NonExistentPermanentPostException } from '@core/domain/post/use-case/exception/permanent_post.exception';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import QueryPermanentPostGateway from '@core/domain/post/use-case/gateway/query_permanent_post.gateway';

@Injectable()
export class DeletePermanentPostService implements DeletePermanentPostInteractor {
    private readonly logger: Logger = new Logger(DeletePermanentPostService.name);

    constructor(
        @Inject(PostDITokens.PermanentPostRepository)
        private readonly gateway: DeletePermanentPostGateway
    ) { }

    async execute({ post_id }: DeletePermanentPostInputModel): Promise<DeletePermanentPostOutputModel> {
        this.logger.log(await this.gateway.deleteById(post_id));
        return {};
    }
}