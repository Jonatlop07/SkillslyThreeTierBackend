import { Inject } from '@nestjs/common';
import { EmptyPermanentPostContentException } from '@core/domain/permanent-post/use-case/exception/permanent_post.exception';
import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import { PermanentPost } from '@core/domain/permanent-post/entity/permanent_post';
import CreatePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/create_permanent_post.input_model';
import { CreatePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/create_permanent_post.interactor';
import CreatePermanentPostGateway from '@core/domain/permanent-post/use-case/gateway/create_permanent_post.gateway';
import { PermanentPostMapper } from '@core/domain/permanent-post/use-case/mapper/permanent_post.mapper';
import CreatePermanentPostOutputModel from '@core/domain/permanent-post/use-case/output-model/create_permanent_post.output_model';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import QueryGroupGateway from '@core/domain/group/use-case/gateway/query_group.gateway';

export class CreatePermanentPostService implements CreatePermanentPostInteractor {
  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly gateway: CreatePermanentPostGateway,
    @Inject(GroupDITokens.GroupRepository)
    private readonly group_gateway: QueryGroupGateway,
  ) {}

  async execute(
    input: CreatePermanentPostInputModel,
  ): Promise<CreatePermanentPostOutputModel> {
    const { owner_id, content, privacy, group_id } = input;
    const post_to_create: PermanentPost = PermanentPostMapper.toPermanentPost({
      owner_id,
      content,
      privacy,
      group_id
    });
    if (!post_to_create.hasNonEmptyContent()) {
      throw new EmptyPermanentPostContentException();
    }
    const created_permanent_post: PermanentPostDTO = await this.gateway.create({
      owner_id,
      content,
      privacy,
      group_id
    });
    return {
      created_permanent_post
    };
  }
}
