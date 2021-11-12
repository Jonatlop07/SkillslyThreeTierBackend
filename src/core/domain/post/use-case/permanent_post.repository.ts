import CreatePermanentPostGateway from './gateway/create_permanent_post.gateway';
import QueryPermanentPostGateway from './gateway/query_permanent_post.gateway';
import QueryPermanentPostCollectionGateway from './gateway/query_permanent_post_collection.gateway';

export default interface PermanentPostRepository extends CreatePermanentPostGateway, QueryPermanentPostCollectionGateway, QueryPermanentPostGateway{}