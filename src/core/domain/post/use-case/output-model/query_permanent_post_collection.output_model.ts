import { PermanentPostDTO } from '../persistence-dto/permanent_post.dto';

export default interface QueryPermanentPostCollectionOutputModel {
  posts: PermanentPostDTO[]
}
