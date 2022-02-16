import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import GroupPosts from '../persistence/group_posts';
import PermanentPostQueryModel from '../query-model/permanent_post.query_model';
import FindOne from '@core/common/persistence/find/find_one';
import Delete from '@core/common/persistence/delete/delete';

export default interface DeletePermanentPostGateway
  extends Delete<PermanentPostQueryModel, PermanentPostDTO>, FindOne<PermanentPostQueryModel, PermanentPostDTO>, GroupPosts{ }
