import { Optional } from '@core/common/type/common_types';
import { ReactionDTO } from '@core/domain/reaction/use_case/persistence-dto/reaction.dto';
import ReactionQueryModel from '@core/domain/reaction/use_case/query-model/reaction.query_model';
import { ReactionRepository } from '@core/domain/reaction/use_case/repository/reaction.repository';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import { ReactionCollectionResult } from '@core/domain/reaction/use_case/persistence-dto/reaction_collection_result';

export class ReactionInMemoryRepository implements ReactionRepository {

  private last_added_reaction_id: string;

  constructor(private reactions: Map<string, ReactionDTO>) {
    this.last_added_reaction_id = '1';
  }

  public create(reaction: ReactionDTO): Promise<ReactionDTO> {
    const added_reaction: ReactionDTO = {
      reaction_id: this.last_added_reaction_id,
      post_id: reaction.post_id,
      reactor_id: reaction.reactor_id,
      reaction_type: reaction.reaction_type,
      created_at: getCurrentDate()
    };
    this.reactions.set(this.last_added_reaction_id, added_reaction);
    this.last_added_reaction_id = `${Number(this.last_added_reaction_id) + 1}`;
    return Promise.resolve(added_reaction);
  }

  public delete(params: ReactionQueryModel): Promise<ReactionDTO> {
    for (const reaction of this.reactions.values()) {
      if (Object.keys(params).every((key: string) => params[key] === reaction[key])) {
        const deleted_reaction = this.reactions.get(reaction.reaction_id);
        this.reactions.delete(reaction.reaction_id);
        return Promise.resolve(deleted_reaction);
      }
    }
    return Promise.resolve(undefined);
  }

  public findOne(params: ReactionQueryModel): Promise<Optional<ReactionDTO>> {
    for (const reaction of this.reactions.values()) {
      if (Object.keys(params).every((key: string) => params[key] === reaction[key])) {
        return Promise.resolve(reaction);
      }
    }
    return Promise.resolve(undefined);
  }

  public findAll(params: ReactionQueryModel): Promise<ReactionCollectionResult[]> {
    const existing_reactions: ReactionDTO[] = [];
    for (const reaction of this.reactions.keys()) {
      if (this.reactions.get(reaction).post_id === params.post_id) {
        existing_reactions.push({
          post_id: this.reactions.get(reaction).post_id,
          reaction_type: this.reactions.get(reaction).reaction_type,
          reactor_id: this.reactions.get(reaction).reactor_id
        });
      }
    }
    return Promise.resolve(existing_reactions);
  }
}
