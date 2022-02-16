import Delete from '@core/common/persistence/delete';
import Find from '@core/common/persistence/find';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import GroupPosts from '../persistence/group_posts';
import PermanentPostQueryModel from '../query-model/permanent_post.query_model';

export default interface DeletePermanentPostGateway extends Delete<PermanentPostDTO, string>, Find<PermanentPostDTO, PermanentPostQueryModel>, GroupPosts{ }
