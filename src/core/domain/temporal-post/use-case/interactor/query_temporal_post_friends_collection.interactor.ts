import { Interactor } from '@core/common/use-case/interactor';
import QueryTemporalPostFriendsCollectionInputModel
  from '@core/domain/temporal-post/use-case/input-model/query_temporal_post_friends_collection.input_model';
import QueryTemporalPostFriendsCollectionOutputModel
  from '@core/domain/temporal-post/use-case/output-model/query_temporal_post_friends_collection.output_model';
export interface QueryTemporalPostFriendsCollectionInteractor
  extends Interactor<QueryTemporalPostFriendsCollectionInputModel, QueryTemporalPostFriendsCollectionOutputModel> {
}
