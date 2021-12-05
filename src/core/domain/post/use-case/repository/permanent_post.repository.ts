import QueryPermanentPostCollectionGateway
  from '@core/domain/post/use-case/gateway/query_permanent_post_collection.gateway';
import QueryPermanentPostGateway from '@core/domain/post/use-case/gateway/query_permanent_post.gateway';
import DeletePermanentPostGateway from '@core/domain/post/use-case/gateway/delete_permanent_post.gateway';
import CreatePermanentPostGateway from '@core/domain/post/use-case/gateway/create_permanent_post.gateway';
import { UpdatePermanentPostGateway } from '@core/domain/post/use-case/gateway/update_permanent_post.gateway';
import { SharePermanentPostGateway } from '@core/domain/post/use-case/gateway/share_permanent_post.gateway';

export default interface PermanentPostRepository
  extends CreatePermanentPostGateway, QueryPermanentPostCollectionGateway,
  QueryPermanentPostGateway, DeletePermanentPostGateway, UpdatePermanentPostGateway, SharePermanentPostGateway { }
