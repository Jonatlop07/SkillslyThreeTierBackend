import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';

export default interface QueryPermanentPostOutputModel {
  permanent_post: PermanentPostDTO
}
