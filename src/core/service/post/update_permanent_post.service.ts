import { UpdatePermanentPostInteractor } from '@core/domain/post/use-case/update_permanent_post.interactor';
import UpdatePermanentPostInputModel from '@core/domain/post/input-model/update_permanent_post.input_model';
import { UpdatePermanentPostOutputModel } from '@core/domain/post/use-case/output-model/update_permanent_post.output_model';
import { UpdatePermanentPostGateway } from '@core/domain/post/use-case/gateway/update_permanent_post.gateway';

export class UpdatePermanentPostService implements UpdatePermanentPostInteractor {
  constructor(
    @Inject(PostDITokens.PostRepository)
    private readonly gateway: UpdatePermanentPostGateway
  ) {

  }

  execute(input: UpdatePermanentPostInputModel): Promise<UpdatePermanentPostOutputModel> {
    return Promise.resolve(undefined);
  }
}
