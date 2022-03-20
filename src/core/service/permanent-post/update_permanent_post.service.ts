import { Inject, Logger } from '@nestjs/common';
import { UpdatePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/update_permanent_post.interactor';
import UpdatePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/update_permanent_post.input_model';
import { UpdatePermanentPostOutputModel } from '@core/domain/permanent-post/use-case/output-model/update_permanent_post.output_model';
import { UpdatePermanentPostGateway } from '@core/domain/permanent-post/use-case/gateway/update_permanent_post.gateway';
import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import {
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException
} from '@core/domain/permanent-post/use-case/exception/permanent_post.exception';
import { PermanentPostMapper } from '@core/domain/permanent-post/use-case/mapper/permanent_post.mapper';
import { PermanentPost } from '@core/domain/permanent-post/entity/permanent_post';

export class UpdatePermanentPostService implements UpdatePermanentPostInteractor {
  private readonly logger: Logger = new Logger();

  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly gateway: UpdatePermanentPostGateway
  ) {}

  async execute(input: UpdatePermanentPostInputModel): Promise<UpdatePermanentPostOutputModel> {
    const post: PermanentPost = PermanentPostMapper.toPermanentPost({
      post_id: input.id,
      content: input.content,
      owner_id: input.owner_id,
      privacy: input.privacy
    });
    if (!post.hasNonEmptyContent())
      throw new EmptyPermanentPostContentException();
    const matching_post: PermanentPostDTO = await this.gateway.findOne({ post_id: input.id });
    if (!matching_post)
      throw new NonExistentPermanentPostException();
    const updated_post: PermanentPostDTO = await this.gateway.update(PermanentPostMapper.toPermanentPostDTO(post));
    return updated_post as UpdatePermanentPostOutputModel;
  }
}
