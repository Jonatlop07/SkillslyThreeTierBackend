import { Inject } from '@nestjs/common';
import { UpdatePermanentPostInteractor } from '@core/domain/post/use-case/update_permanent_post.interactor';
import UpdatePermanentPostInputModel from '@core/domain/post/input-model/update_permanent_post.input_model';
import { UpdatePermanentPostOutputModel } from '@core/domain/post/use-case/output-model/update_permanent_post.output_model';
import { UpdatePermanentPostGateway } from '@core/domain/post/use-case/gateway/update_permanent_post.gateway';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence_dto/permanent_post.dto';
import {
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException,
  UnauthorizedPermanentPostContentException
} from '@core/service/post/permanent_post.exception';
import { PermanentPostMapper } from '@core/domain/post/use-case/mapper/permanent_post.mapper';
import { PermanentPost } from '@core/domain/post/entity/permanent_post';

export class UpdatePermanentPostService implements UpdatePermanentPostInteractor {
  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly gateway: UpdatePermanentPostGateway
  ) {}

  async execute(input: UpdatePermanentPostInputModel): Promise<UpdatePermanentPostOutputModel> {
    const post: PermanentPost = PermanentPostMapper.toPermanentPost(input as PermanentPostDTO);
    if (post.hasNonEmptyContent())
      throw new EmptyPermanentPostContentException();
    const matching_post: PermanentPostDTO = await this.gateway.findOneByParam(input.id, 'id');
    if (!matching_post)
      throw new NonExistentPermanentPostException();
    if (matching_post.user_id !== post.user_id)
      throw new UnauthorizedPermanentPostContentException();
    const updated_post: PermanentPostDTO = await this.gateway.update(post);
    return updated_post as UpdatePermanentPostOutputModel;
  }
}
