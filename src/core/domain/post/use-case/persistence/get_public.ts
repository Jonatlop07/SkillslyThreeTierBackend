import { PermanentPostDTO } from '../persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '../query-model/permanent_post.query_model';

export default interface GetPublic {
  getPublicPosts(param: PermanentPostQueryModel): Promise<Array<PermanentPostDTO>>;
}
