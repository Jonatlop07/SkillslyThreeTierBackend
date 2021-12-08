import { isValidType } from '@core/common/util/reaction_data.validators';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import QueryPermanentPostGateway from '@core/domain/post/use-case/gateway/query_permanent_post.gateway';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { AddReactionInvalidTypeException, AddReactionUnexistingPostException } from '@core/domain/reaction/use_case/exception/reaction.exception';
import AddReactionGateway from '@core/domain/reaction/use_case/gateway/add_reaction.gateway';
import AddReactionInputModel from '@core/domain/reaction/use_case/input-model/add_reaction.input_model';
import { AddReactionInteractor } from '@core/domain/reaction/use_case/interactor/add_reaction.interactor';
import AddReactionOutputModel from '@core/domain/reaction/use_case/output-model/add_reaction.output_model';
import { ReactionDTO } from '@core/domain/reaction/use_case/persistence-dto/reaction.dto';
import { Inject } from '@nestjs/common';

export class AddReactionService implements AddReactionInteractor{

  constructor(
    @Inject(ReactionDITokens.ReactionRepository)
    private readonly gateway: AddReactionGateway,
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly post_gateway: QueryPermanentPostGateway,
  ){}

  async execute(input: AddReactionInputModel): Promise<AddReactionOutputModel> {
    const { post_id, reactor_id, reaction_type } = input;
    const existing_post = await this.post_gateway.findOne({post_id: post_id});
    if (existing_post === undefined){
      throw new AddReactionUnexistingPostException();
    }
    if (!isValidType(reaction_type)){
      throw new AddReactionInvalidTypeException();
    }
    const existing_reaction = await this.gateway.findOne({post_id: post_id, reactor_id: reactor_id});
    if (existing_reaction !== undefined){
      if (existing_reaction.post_id !== undefined){
        return await this.gateway.delete({post_id: existing_reaction.post_id, reactor_id: existing_reaction.reactor_id}) as AddReactionOutputModel;
      }
    }
    const reaction: ReactionDTO = {
      post_id,
      reactor_id,
      reaction_type,
    };
    return await this.gateway.create(reaction) as AddReactionOutputModel;
  }
  
}