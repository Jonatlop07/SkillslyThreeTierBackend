import PermanentPostQueryModel from '@core/domain/permanent-post/use-case/query-model/permanent_post.query_model';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import GroupPosts from '../persistence/group_posts';
import FindAll from '@core/common/persistence/find_all';
import FindOne from '@core/common/persistence/find_one';
import GetPublic from '@core/domain/permanent-post/use-case/persistence/get_public';

export default interface QueryPermanentPostCollectionGateway
  extends FindOne<PermanentPostQueryModel, PermanentPostDTO>,
    FindAll<PermanentPostQueryModel, PermanentPostDTO>, GroupPosts, GetPublic {}
