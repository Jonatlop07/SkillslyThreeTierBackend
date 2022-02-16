import { Optional } from '@core/common/type/common_types';
import PermanentPostRepository from '@core/domain/permanent-post/use-case/repository/permanent_post.repository';
import { PermanentPostDTO } from '@core/domain/permanent-post/use-case/persistence-dto/permanent_post.dto';
import PermanentPostQueryModel from '@core/domain/permanent-post/use-case/query-model/permanent_post.query_model';
import { PaginationDTO } from '@application/api/http-rest/http-dto/http_pagination.dto';
import { getCurrentDate } from '@core/common/util/date/moment_utils';
import CreatePermanentPostPersistenceDTO
  from '@core/domain/permanent-post/use-case/persistence-dto/create_permanent_post.persistence_dto';

export class PermanentPostInMemoryRepository implements PermanentPostRepository {
  private currently_available_post_id: string;

  constructor(private readonly posts: Map<string, PermanentPostDTO>) {
    this.currently_available_post_id = '1';
  }

  public getGroupPosts(group_id: string, pagination: PaginationDTO): Promise<PermanentPostDTO[]> {
    pagination;
    const group_posts: PermanentPostDTO[] = [];
    for (const post of this.posts.values()){
      if (post.group_id === group_id){
        group_posts.push(post);
      }
    }
    return Promise.resolve(group_posts);
  }

  delete(params: string): Promise<PermanentPostDTO> {
    params;
    throw new Error('Method not implemented.');
  }

  public create(post: CreatePermanentPostPersistenceDTO): Promise<PermanentPostDTO> {
    const new_post: PermanentPostDTO = {
      post_id: this.currently_available_post_id,
      content: post.content,
      owner_id: post.owner_id,
      privacy: post.privacy,
      created_at: getCurrentDate(),
      group_id: post.group_id ? post.group_id : '0'
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
      if (params.owner_id === post.owner_id && post.privacy === 'public'){
        user_posts.push(post);
      }
    }
    return Promise.resolve(user_posts);
  }

  public getPostsOfFriends(id: string, pagination: PaginationDTO): Promise<PermanentPostDTO[]> {
    pagination;
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

  public findAllWithRelation() {
    return null;
  }


  public update(post: PermanentPostDTO): Promise<PermanentPostDTO> {
    const post_to_update: PermanentPostDTO = {
      post_id: post.post_id,
      content: post.content,
      owner_id: post.owner_id,
      privacy: post.privacy,
      updated_at: getCurrentDate(),
    };
    this.posts.set(post.post_id, post_to_update);
    return Promise.resolve(post_to_update);
  }

  public share(post: PermanentPostQueryModel): Promise<void> {
    post;
    return Promise.resolve();
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

  deleteGroupPost(post_id: string, group_id: string): Promise<void> {
    group_id;
    for (const post of this.posts.values()){
      if (post.post_id === post_id){
        this.posts.delete(post_id);
      }
    }
    return Promise.resolve();
  }
}
