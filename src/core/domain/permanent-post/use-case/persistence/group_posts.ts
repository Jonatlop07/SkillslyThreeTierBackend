import { PaginationDTO } from '@core/common/persistence/pagination.dto';
import { PermanentPostDTO } from '../persistence-dto/permanent_post.dto';

export default interface GroupPosts {
  getGroupPosts(group_id: string, pagination: PaginationDTO): Promise<Array<PermanentPostDTO>>;
  deleteGroupPost(post_id: string, group_id: string): Promise<void>;
}
