import { QueryReactionElement } from '../../entity/type/queried_reactions_element';
import { ReactionDTO } from '../persistence-dto/reaction.dto';

export interface QueryReactionsOutputModel{
  reactions?: QueryReactionElement[] | ReactionDTO[];
}