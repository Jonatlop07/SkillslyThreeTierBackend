import { Inject, Injectable, Logger } from '@nestjs/common';
import { DeletePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/delete_permanent_post.interactor';
import DeletePermanentPostInputModel
  from '@core/domain/permanent-post/use-case/input-model/delete_permanent_post.input_model';
import DeletePermanentPostOutputModel
  from '@core/domain/permanent-post/use-case/output-model/delete_permanent_post.output_model';
import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import DeleteGroupPostGateway from '@core/domain/group/use-case/gateway/delete_group_post.gateway';
import { UnauthorizedGroupEditorException } from '@core/domain/group/use-case/exception/group.exception';
import DeletePermanentPostGateway from '@core/domain/permanent-post/use-case/gateway/delete_permanent_post.gateway';

@Injectable()
export class DeletePermanentPostService implements DeletePermanentPostInteractor {
  private readonly logger: Logger = new Logger(DeletePermanentPostService.name);

  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly gateway: DeletePermanentPostGateway,
    @Inject(GroupDITokens.GroupRepository)
    private readonly group_gateway: DeleteGroupPostGateway
  ) {
  }

  async execute(input: DeletePermanentPostInputModel): Promise<DeletePermanentPostOutputModel> {
    if (input.group_id) {
      const is_owner = await this.group_gateway.userIsOwner({ user_id: input.user_id, group_id: input.group_id });
      const post_to_delete = await this.gateway.findOne({ post_id: input.post_id });
      if (!is_owner && post_to_delete.owner_id !== input.user_id) {
        throw new UnauthorizedGroupEditorException();
      }
      await this.gateway.deleteGroupPost(input.post_id, input.group_id);
      return {};
    }
    await this.gateway.deleteById(input.post_id);
    return {};
  }
}
