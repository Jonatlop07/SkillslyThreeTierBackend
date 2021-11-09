import CreatePermanentPostInputModel from '@core/domain/post/input-model/create_permanent_post.input_model';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/create_permanent_post.interactor';
import CreatePermanentPostOutputModel from '@core/domain/post/use-case/output-model/create_permanent_post.output_model';

export class CreatePermanentPostService
  implements CreatePermanentPostInteractor
{
  execute(
    input: CreatePermanentPostInputModel,
  ): Promise<CreatePermanentPostOutputModel> {
    const { post_description, post_references, post_reference_types } = input;
  }
}
