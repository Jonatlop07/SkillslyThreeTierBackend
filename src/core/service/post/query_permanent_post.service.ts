import { PostDITokens } from '@core/domain/post/di/permanent_post_di_tokens';
import QueryPermanentPostInputModel from '@core/domain/post/input-model/query_permanent_post.input_model';
import { QueryPermanentPostInteractor } from '@core/domain/post/use-case/query_permanent_post.interactor';
import QueryPermanentPostGateway from '@core/domain/post/use-case/gateway/query_permanent_post.gateway';
import QueryPermanentPostOutputModel from '@core/domain/post/use-case/output-model/query_permanent_post.output_model';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import { Inject } from '@nestjs/common';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { QueryPermanentPostUnexistingPostException, QueryPermanentPostUnexistingUserException } from './query_permanent_post.exception';


export class QueryPermanentPostService implements QueryPermanentPostInteractor{
  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly gateway: QueryPermanentPostGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: SearchUsersGateway,
  ){}


  async execute(input: QueryPermanentPostInputModel): Promise<QueryPermanentPostOutputModel> {
    const user = await this.user_gateway.findOneByParam('user_id', input.user_id);
    if (!user){
      throw new QueryPermanentPostUnexistingUserException();
    }
    const query_post: PermanentPostDTO = await this.gateway.findOne({ post_id: input.id, user_id: input.user_id });
    if (!query_post){
      throw new QueryPermanentPostUnexistingPostException();
    }
    return query_post as QueryPermanentPostOutputModel;
  }

}