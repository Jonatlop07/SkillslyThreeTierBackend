import PermanentPostRepository from '@core/domain/post/use-case/permanent_post.repository';
import { Optional } from '@core/common/type/common_types';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import * as moment from 'moment';

export class PermanentPostInMemoryRepository implements PermanentPostRepository{
  private currently_available_post_id: string;

  constructor(private readonly posts: Map<string, PermanentPostDTO>) {}
  create(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const created_post: PermanentPostDTO = {
      post_id: this.currently_available_post_id,
      content: post.content,
      user_id: post.user_id,
      created_at: moment().format('DD/MM/YYYY')
    };
    this.posts.set(post.post_id, created_post);
    this.currently_available_post_id = `${Number(this.currently_available_post_id) + 1}`;
    return Promise.resolve(created_post);
  }

  findOneByParam(
    param: string,
    value: any,
  ): Promise<Optional<PermanentPostDTO>> {
    for (const _post of this.posts.values())
      if (_post[param] === value) return Promise.resolve(_post);
    return Promise.resolve(undefined);
  }
}
