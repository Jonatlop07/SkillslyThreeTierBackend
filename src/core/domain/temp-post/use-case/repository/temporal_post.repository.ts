import CreateTemporalPostGateway from '@core/domain/temp-post/use-case/gateway/create_temporal_post.gateway';
import QueryTemporalPostGateway from '@core/domain/temp-post/use-case/gateway/query_temporal_post.gateway';

export default interface TemporalPostRepository extends CreateTemporalPostGateway, QueryTemporalPostGateway {

}