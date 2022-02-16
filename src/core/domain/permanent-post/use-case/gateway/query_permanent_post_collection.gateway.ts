import Find from '@core/common/persistence/find';
import PermanentPostQueryModel from '@core/domain/permanent-post/use-case/query-model/permanent_post.query_model';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import GetPublic from '../persistence/get_public';
import GroupPosts from '../persistence/group_posts';

export default interface QueryPermanentPostCollectionGateway extends Find<PermanentPostDTO, PermanentPostQueryModel>, GetPublic, GroupPosts{}
