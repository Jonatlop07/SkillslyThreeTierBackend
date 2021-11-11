import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import { PermanentPost } from '@core/domain/post/entity/permanent_post';

export class PermanentPostMapper {
  public static toPermanentPostDTO(post: PermanentPost): PermanentPostDTO {
    return {
      post_id: post.id,
      content: post.content,
      user_id: post.user_id
    };
  }

  public static toPermanentPost(postDTO: PermanentPostDTO): PermanentPost {
    return new PermanentPost({
      id: postDTO.post_id,
      content: postDTO.content,
      user_id: postDTO.user_id
    });
  }
}
