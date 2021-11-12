import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import QueryPermanentPostCollectionInputModel from '@core/domain/post/input-model/query_permanent_post_collection.input_model';
import QueryPermanentPostCollectionGateway from '@core/domain/post/use-case/gateway/query_permanent_post_collection.gateway';
import QueryPermanentPostCollectionOutputModel from '@core/domain/post/use-case/output-model/query_permanent_post_collection.output_model';
import { QueryPermanentPostCollectionInteractor } from '@core/domain/post/use-case/query_permanent_post_collection.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { Inject } from '@nestjs/common';
import { QueryPermanentPostUnexistingUserException } from './query_permanent_post.exception';

export class QueryPermanentPostCollectionService implements QueryPermanentPostCollectionInteractor{
  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly post_gateway: QueryPermanentPostCollectionGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: SearchUsersGateway
  ){}
  async execute(input: QueryPermanentPostCollectionInputModel): Promise<QueryPermanentPostCollectionOutputModel> {
    const owner_id = input.user_id;
    const owner = await this.user_gateway.findOneByParam('user_id', owner_id);
    if (!owner){
      throw new QueryPermanentPostUnexistingUserException();
    }
    const all_posts = await this.post_gateway.findAll({ user_id: owner_id });
    const post_collection: QueryPermanentPostCollectionOutputModel = {
      posts: all_posts
    };
    return Promise.resolve(post_collection);
  }

}