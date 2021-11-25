import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import QueryPermanentPostGateway from '@core/domain/post/use-case/gateway/query_permanent_post.gateway';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import QueryReactionsInputModel from '@core/domain/reaction/input-model/query_reactions.output_model';
import { QueryReactionsUnexistingPostException } from '@core/domain/reaction/use_case/exception/reaction.exception';
import QueryReactionsGateway from '@core/domain/reaction/use_case/gateway/query_reactions.gateway';
import { QueryReactionsInteractor } from '@core/domain/reaction/use_case/interactor/query_reactions.interactor';
import { QueryReactionsOutputModel } from '@core/domain/reaction/use_case/output-model/query_reactions.output_model';
import { Inject } from '@nestjs/common';

export class QueryReactionsService implements QueryReactionsInteractor{

  constructor(
    @Inject(ReactionDITokens.ReactionRepository)
    private readonly gateway: QueryReactionsGateway,
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly post_gateway: QueryPermanentPostGateway,
  ){}

  async execute(input: QueryReactionsInputModel): Promise<QueryReactionsOutputModel> {
    const existing_post = await this.post_gateway.findOne({post_id: input.post_id});
    if (existing_post === undefined){
      throw new QueryReactionsUnexistingPostException();
    }
    const existing_reactions = await this.gateway.queryById(input.post_id);
    return {reactions: existing_reactions};
  }
  
}