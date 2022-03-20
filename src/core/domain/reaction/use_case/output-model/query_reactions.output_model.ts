import { ReactionCollectionResult } from '@core/domain/reaction/use_case/persistence-dto/reaction_collection_result';

export interface QueryReactionsOutputModel{
  reactions?: Array<ReactionCollectionResult>;
}
