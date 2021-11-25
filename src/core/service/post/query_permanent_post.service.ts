import { Inject, Logger } from '@nestjs/common';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import QueryPermanentPostInputModel from '@core/domain/post/use-case/input-model/query_permanent_post.input_model';
import { QueryPermanentPostInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post.interactor';
import QueryPermanentPostGateway from '@core/domain/post/use-case/gateway/query_permanent_post.gateway';
import QueryPermanentPostOutputModel from '@core/domain/post/use-case/output-model/query_permanent_post.output_model';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import {
  NonExistentPermanentPostException,
  NonExistentUserException
} from '@core/domain/post/use-case/exception/permanent_post.exception';

export class QueryPermanentPostService implements QueryPermanentPostInteractor{
  private readonly logger: Logger = new Logger(QueryPermanentPostService.name);

  constructor(
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly gateway: QueryPermanentPostGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly user_gateway: SearchUsersGateway,
  ) {}

  async execute(input: QueryPermanentPostInputModel): Promise<QueryPermanentPostOutputModel> {
    const user = await this.user_gateway.findOne({ user_id: input.user_id });
    if (!user){
      throw new NonExistentUserException();
    }
    const query_post: PermanentPostDTO = await this.gateway.findOne({ post_id: input.id, user_id: input.user_id });
    if (!query_post){
      throw new NonExistentPermanentPostException();
    }
    this.logger.log(query_post.user_id);
    return query_post as QueryPermanentPostOutputModel;
  }
}
