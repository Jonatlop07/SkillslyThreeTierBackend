import FindAll from '@core/common/persistence/find_all';
import ReactionQueryModel from '@core/domain/reaction/use_case/query-model/reaction.query_model';
import { ReactionCollectionResult } from '@core/domain/reaction/use_case/persistence-dto/reaction_collection_result';

export default interface QueryReactionsGateway extends FindAll<ReactionQueryModel, ReactionCollectionResult>{}
