import { PostDITokens } from '@core/domain/post/di/permanent_post_di_tokens';
import { PermanentPost } from '@core/domain/post/entity/permanent_post';
import CreatePermanentPostInputModel from '@core/domain/post/input-model/create_permanent_post.input_model';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/create_permanent_post.interactor';
import CreatePermanentPostGateway from '@core/domain/post/use-case/gateway/create_permanent_post.gateway';
import { PermanentPostMapper } from '@core/domain/post/use-case/mapper/permanent_post_mapper';
import CreatePermanentPostOutputModel from '@core/domain/post/use-case/output-model/create_permanent_post.output_model';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import { Inject } from '@nestjs/common';
import { CreatePermanentPostEmptyContentException } from './create_permanent_post.exception';

export class CreatePermanentPostService implements CreatePermanentPostInteractor{
  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly gateway: CreatePermanentPostGateway,
  ){}

  async execute(
    input: CreatePermanentPostInputModel,
  ): Promise<CreatePermanentPostOutputModel> {
    const post_to_create: PermanentPost = PermanentPostMapper.toPermanentPost(
      input as PermanentPostDTO
    );
    if (!post_to_create.hasNonEmptyContent()){
      throw new CreatePermanentPostEmptyContentException();
    }
    const created_post: PermanentPostDTO = await this.gateway.create(input);
    return created_post as CreatePermanentPostOutputModel;

  }
}
