import { Inject } from '@nestjs/common';
import { EmptyPermanentPostContentException } from '@core/domain/post/use-case/exception/permanent_post.exception';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { PermanentPost } from '@core/domain/post/entity/permanent_post';
import CreatePermanentPostInputModel from '@core/domain/post/use-case/input-model/create_permanent_post.input_model';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/create_permanent_post.interactor';
import CreatePermanentPostGateway from '@core/domain/post/use-case/gateway/create_permanent_post.gateway';
import { PermanentPostMapper } from '@core/domain/post/use-case/mapper/permanent_post.mapper';
import CreatePermanentPostOutputModel from '@core/domain/post/use-case/output-model/create_permanent_post.output_model';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
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
    const post_to_create: PermanentPost = PermanentPostMapper.toPermanentPost(
      input as PermanentPostDTO,
    );
    if (!post_to_create.hasNonEmptyContent()) {
      throw new EmptyPermanentPostContentException();
    }
    return await this.gateway.create(input) as CreatePermanentPostOutputModel;
  }
}
