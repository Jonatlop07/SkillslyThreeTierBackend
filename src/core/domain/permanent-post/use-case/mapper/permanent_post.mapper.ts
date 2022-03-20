import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import { PermanentPost } from '@core/domain/permanent-post/entity/permanent_post';

export class PermanentPostMapper {
  public static toPermanentPostDTO(post: PermanentPost): PermanentPostDTO {
    return {
      post_id: post.id,
      content: post.content,
      owner_id: post.owner_id,
      privacy: post.privacy,
    };
  }

  public static toPermanentPost(postDTO: PermanentPostDTO): PermanentPost {
    return new PermanentPost({
      id: postDTO.post_id,
      content: postDTO.content,
      owner_id: postDTO.owner_id,
      privacy: postDTO.privacy,
    });
  }
}
