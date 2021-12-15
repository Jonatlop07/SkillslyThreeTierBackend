import { Optional } from '@core/common/type/common_types';
import PermanentPostRepository from '@core/domain/post/use-case/repository/permanent_post.repository';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/post/use-case/query-model/permanent_post.query_model';
import * as moment from 'moment';
import SharePermanentPostOutputModel from '@core/domain/post/use-case/output-model/share_permanent_post.output_model';
import { PaginationDTO } from '@application/api/http-rest/http-dtos/http_pagination.dto';

export class PermanentPostInMemoryRepository implements PermanentPostRepository {
  private currently_available_post_id: string;

  constructor(private readonly posts: Map<string, PermanentPostDTO>) {
    this.currently_available_post_id = '1';
  }
  delete(params: string): Promise<PermanentPostDTO> {
    throw new Error('Method not implemented.');
  }

  public create(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const new_post: PermanentPostDTO = {
      post_id: this.currently_available_post_id,
      content: post.content,
      user_id: post.user_id,
      privacy: post.privacy,
      created_at: moment().local().format('YYYY/MM/DD HH:mm:ss')
    };
    this.posts.set(this.currently_available_post_id, new_post);
    this.currently_available_post_id = `${Number(this.currently_available_post_id) + 1}`;
    return Promise.resolve(new_post);
  }

  public exists(post: PermanentPostDTO): Promise<boolean> {
    for (const _post of this.posts.values())
      if (_post.post_id === post.post_id)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }

  public existsById(id: string): Promise<boolean> {
    for (const _post of this.posts.values())
      if (_post.post_id === id)
        return Promise.resolve(true);
    return Promise.resolve(false);
  }

  public findAll(params: PermanentPostQueryModel): Promise<PermanentPostDTO[]> {
    const user_posts: PermanentPostDTO[] = [];
    for (const post of this.posts.values()) {
      if (Object.keys(params).every((key: string) => {
        return params[key] === post[key];
      })) {
        user_posts.push(post);
      }
    }
    return Promise.resolve(user_posts);
  }

  public getPublicPosts(params: PermanentPostQueryModel): Promise<PermanentPostDTO[]> {
    const user_posts: PermanentPostDTO[] = [];
    for (const post of this.posts.values()){
      if (params.user_id === post['user_id'] && post.privacy === 'public'){
        user_posts.push(post);
      }
    }
    return Promise.resolve(user_posts);
  }

  public getPostsOfFriends(id: string, pagination: PaginationDTO): Promise<PermanentPostDTO[]> {
    const user_posts: PermanentPostDTO[] = [];
    for (const post of this.posts.values()){
      if (id === post['user_id'] && post.privacy === 'public'){
        user_posts.push(post);
      }
    }
    return Promise.resolve(user_posts);
  }

  public findOne(params: PermanentPostQueryModel): Promise<Optional<PermanentPostDTO>> {
    for (const post of this.posts.values()) {
      if (Object.keys(params).every((key: string) => params[key] === post[key])) {
        return Promise.resolve(post);
      }
    }
    return Promise.resolve(undefined);
  }

  public update(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const post_to_update: PermanentPostDTO = {
      post_id: post.post_id,
      content: post.content,
      user_id: post.user_id,
      privacy: post.privacy,
      updated_at: moment().local().format('YYYY/MM/DD HH:mm:ss'),
    };
    this.posts.set(post.post_id, post_to_update);
    return Promise.resolve(post_to_update);
  }

  public share(post: PermanentPostQueryModel): Promise<SharePermanentPostOutputModel> {
    return Promise.resolve({});
  }

  public deleteById(post_id: string): Promise<PermanentPostDTO> {
    for (const _post of this.posts.values()) {
      if (_post.post_id === post_id) {
        this.posts.delete(post_id);
        return Promise.resolve(_post);
      }
    }
    return Promise.resolve(undefined);
  }
}
