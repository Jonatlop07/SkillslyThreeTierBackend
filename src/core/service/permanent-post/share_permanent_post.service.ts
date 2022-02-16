import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import {
  NonExistentPermanentPostException,
  NonExistentUserException
} from '@core/domain/permanent-post/use-case/exception/permanent_post.exception';
import { SharePermanentPostGateway } from '@core/domain/permanent-post/use-case/gateway/share_permanent_post.gateway';
import SharePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/share_permanent_post.input_model';
import { SharePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/share_permanent_post.interactor';
import SharePermanentPostOutputModel from '@core/domain/permanent-post/use-case/output-model/share_permanent_post.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import ExistsUsersGateway from '@core/domain/user/use-case/gateway/exists_user.gateway';
import { Inject, Logger } from '@nestjs/common';

export class SharePermanentPostService implements SharePermanentPostInteractor {
  private readonly logger: Logger = new Logger();

  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly post_gateway: SharePermanentPostGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: ExistsUsersGateway
  ) {
  }

  async execute(input: SharePermanentPostInputModel): Promise<SharePermanentPostOutputModel> {
    const exists_user = await this.user_gateway.existsById(input.user_id);
    if (!exists_user) {
      throw new NonExistentUserException();
    }
    const post = await this.post_gateway.findOne({ post_id: input.post_id });
    if (!post) {
      throw new NonExistentPermanentPostException();
    }
    await this.post_gateway.share({ user_that_shares_id: input.user_id, post_id: input.post_id });
    return {
      post_id: post.post_id,
      post_owner_id: post.owner_id,
    };
  }
}
