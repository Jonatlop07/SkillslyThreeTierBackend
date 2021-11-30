import AddReactionGateway from '../gateway/add_reaction.gateway';
import QueryReactionsGateway from '../gateway/query_reactions.gateway';

export interface ReactionRepository extends AddReactionGateway, QueryReactionsGateway{}