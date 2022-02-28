import { QueryReactionElement } from '@core/domain/reaction/entity/type/queried_reactions_element';
import { ReactionDTO } from '@core/domain/reaction/use_case/persistence-dto/reaction.dto';

export type ReactionCollectionResult = QueryReactionElement | ReactionDTO;
