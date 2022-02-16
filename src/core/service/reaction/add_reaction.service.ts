import { isValidType } from '@core/common/util/validators/reaction_data.validators';
import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import QueryPermanentPostGateway from '@core/domain/permanent-post/use-case/gateway/query_permanent_post.gateway';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import {
  AddReactionInvalidTypeException,
  AddReactionUnexistingPostException
} from '@core/domain/reaction/use_case/exception/reaction.exception';
import AddReactionGateway from '@core/domain/reaction/use_case/gateway/add_reaction.gateway';
import AddReactionInputModel from '@core/domain/reaction/use_case/input-model/add_reaction.input_model';
import { AddReactionInteractor } from '@core/domain/reaction/use_case/interactor/add_reaction.interactor';
import AddReactionOutputModel from '@core/domain/reaction/use_case/output-model/add_reaction.output_model';
import { Inject } from '@nestjs/common';
import { ReactionDTO } from '@core/domain/reaction/use_case/persistence-dto/reaction.dto';

export class AddReactionService implements AddReactionInteractor {

  constructor(
    @Inject(ReactionDITokens.ReactionRepository)
    private readonly reaction_gateway: AddReactionGateway,
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly post_gateway: QueryPermanentPostGateway
  ) {
  }

  async execute(input: AddReactionInputModel): Promise<AddReactionOutputModel> {
    const { post_id, reactor_id, reaction_type } = input;
    const existing_post = await this.post_gateway.findOne({ post_id });
    if (!existing_post) {
      throw new AddReactionUnexistingPostException();
    }
    if (!isValidType(reaction_type)) {
      throw new AddReactionInvalidTypeException();
    }
    const existing_reaction = await this.reaction_gateway.findOne({ post_id, reactor_id });
    if (existing_reaction && existing_reaction.post_id) {
      const deleted_reaction: ReactionDTO = await this.reaction_gateway.delete({
        post_id: existing_reaction.post_id,
        reactor_id: existing_reaction.reactor_id
      });
      return {
        post_id: deleted_reaction.post_id,
        post_owner_id: existing_post.owner_id,
        reactor_id: deleted_reaction.reactor_id,
        reaction_type: deleted_reaction.reaction_type,
        added: false
      };
    }
    const created_reaction = await this.reaction_gateway.create({
      post_id,
      reactor_id,
      reaction_type
    });
    return {
      post_id: created_reaction.post_id,
      post_owner_id: existing_post.owner_id,
      reactor_id: created_reaction.reactor_id,
      reaction_type: created_reaction.reaction_type,
      added: true
    };
  }
}
