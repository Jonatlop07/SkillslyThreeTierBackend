import CreateTemporalPostGateway from '@core/domain/temporal-post/use-case/gateway/create_temporal_post.gateway';
import QueryTemporalPostGateway from '@core/domain/temporal-post/use-case/gateway/query_temporal_post.gateway';
import DeleteTemporalPostGateway from '@core/domain/temporal-post/use-case/gateway/delete_temporal_post.gateway';
import QueryTemporalPostCollectionGateway
  from '@core/domain/temporal-post/use-case/gateway/query_temporal_post_collection.gateway';
import QueryTemporalPostFriendsCollectionGateway
  from '@core/domain/temporal-post/use-case/gateway/query_temporal_post_friends_collection.gateway';

export default interface TemporalPostRepository
  extends CreateTemporalPostGateway, QueryTemporalPostGateway, DeleteTemporalPostGateway,
  QueryTemporalPostCollectionGateway, QueryTemporalPostFriendsCollectionGateway {}
