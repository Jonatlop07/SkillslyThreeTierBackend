import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { NonExistentPermanentPostException, NonExistentUserException } from '@core/domain/post/use-case/exception/permanent_post.exception';
import { SharePermanentPostGateway } from '@core/domain/post/use-case/gateway/share_permanent_post.gateway';
import SharePermanentPostInputModel from '@core/domain/post/use-case/input-model/share_permanent_post.input_model';
import { SharePermanentPostInteractor } from '@core/domain/post/use-case/interactor/share_permanent_post.interactor';
import SharePermanentPostOutputModel from '@core/domain/post/use-case/output-model/share_permanent_post.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { Inject, Logger } from '@nestjs/common';

export class SharePermanentPostService implements SharePermanentPostInteractor{
  private readonly logger: Logger = new Logger();

  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly gateway: SharePermanentPostGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: SearchUsersGateway
  ) {}

  async execute(input: SharePermanentPostInputModel): Promise<SharePermanentPostOutputModel> {
    const user = await this.user_gateway.findOneByParam('user_id', input.user_id);
    if (!user){
      throw new NonExistentUserException();
    }
    const post = await this.gateway.findOneByParam('post_id',input.post_id);
    if(!post){
      throw new NonExistentPermanentPostException(); 
    }
    const result = await this.gateway.share({user_id:user.user_id, post_id: post.post_id});
    return result as SharePermanentPostOutputModel; 
  }
}