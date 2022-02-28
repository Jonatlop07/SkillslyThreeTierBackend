import { PermanentPostDTO } from '../persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '../query-model/permanent_post.query_model';
import { PaginationDTO } from '@application/api/http-rest/http-dto/http_pagination.dto';

export default interface GetPublic {
  getPublicPosts(param: PermanentPostQueryModel): Promise<Array<PermanentPostDTO>>;
  getPostsOfFriends(id: string, pagination: PaginationDTO): Promise<Array<PermanentPostDTO>>;
}
