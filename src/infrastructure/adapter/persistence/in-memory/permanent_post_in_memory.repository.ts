import { Optional } from '@core/common/type/common_types';
import PermanentPostRepository from '@core/domain/post/use-case/permanent_post.repository';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import * as moment from 'moment';

export class PermanentPostInMemoryRepository implements PermanentPostRepository{
  private currently_available_post_id: string;

  constructor(private readonly posts: Map<string, PermanentPostDTO>) {
    this.currently_available_post_id = '1';
  }

  findOneByParam(param: string, value: any): Promise<PermanentPostDTO> {
    let post: PermanentPostDTO;
    return Promise.resolve(post);
  }

  findAll(params: PermanentPostQueryModel): Promise<PermanentPostDTO[]> {
    const user_posts: PermanentPostDTO[] = [];
    for (const post of this.posts.values()){
      if (Object.keys(params).every( (key: string) => {
        return params[key] === post[key];
      })){
        user_posts.push(post);
      }
    }
    return Promise.resolve(user_posts);
  }

  findOne(params: PermanentPostQueryModel): Promise<Optional<PermanentPostDTO>> {
    for (const post of this.posts.values()){
      if (Object.keys(params).every( (key: string) => params[key] === post[key])){
        return Promise.resolve(post);
      }
    }
    return Promise.resolve(undefined);
  }
  
  create(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const created_post: PermanentPostDTO = {
      post_id: this.currently_available_post_id,
      content: post.content,
      user_id: post.user_id,
      created_at: moment().format('DD/MM/YYYY')
    };
    this.posts.set(created_post.post_id, created_post);
    this.currently_available_post_id = `${Number(this.currently_available_post_id) + 1}`;
    return Promise.resolve(created_post);
  }
}
