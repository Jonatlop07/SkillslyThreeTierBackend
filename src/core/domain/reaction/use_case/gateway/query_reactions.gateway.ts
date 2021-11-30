import Query from '@core/common/persistence/query';
import { QueryReactionElement } from '../../entity/type/queried_reactions_element';
import { ReactionDTO } from '../persistence-dto/reaction.dto';

export default interface QueryReactionsGateway extends Query<QueryReactionElement[] | ReactionDTO[]>{}