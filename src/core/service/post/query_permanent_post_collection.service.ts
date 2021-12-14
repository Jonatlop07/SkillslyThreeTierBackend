import { Inject, Logger } from '@nestjs/common';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import { NonExistentUserException } from '@core/domain/post/use-case/exception/permanent_post.exception';
import QueryPermanentPostCollectionGateway
  from '@core/domain/post/use-case/gateway/query_permanent_post_collection.gateway';
import { QueryPermanentPostCollectionInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post_collection.interactor';
import QueryPermanentPostCollectionOutputModel
  from '@core/domain/post/use-case/output-model/query_permanent_post_collection.output_model';
import QueryPermanentPostCollectionInputModel
  from '@core/domain/post/use-case/input-model/query_permanent_post_collection.input_model';
import { PermanentPostDTO } from '@core/domain/post/use-case/persistence-dto/permanent_post.dto';
import ExistsUserFollowRelationshipGateway from '@core/domain/user/use-case/gateway/follow_request/exists_user_follow_relationship.gateway';

export class QueryPermanentPostCollectionService implements QueryPermanentPostCollectionInteractor {
  private readonly logger: Logger = new Logger(QueryPermanentPostCollectionService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private readonly search_user_gateway: SearchUsersGateway, 
    @Inject(UserDITokens.UserRepository)
    private readonly relationship_gateway: ExistsUserFollowRelationshipGateway,
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly post_gateway: QueryPermanentPostCollectionGateway,
  ) {}

  async execute(input: QueryPermanentPostCollectionInputModel): Promise<QueryPermanentPostCollectionOutputModel> {
    const {user_id, owner_id} = input;
    let posts: Array<PermanentPostDTO> = [];
    const owner = await this.search_user_gateway.findOne({ user_id: owner_id });
    if (!owner){
      throw new NonExistentUserException();
    }

    if (user_id === owner_id){
      posts = await this.post_gateway.findAll({ user_id: owner_id });
    } else {
      const existsRelationship = await this.relationship_gateway.existsUserFollowRelationship({user_id: user_id, user_destiny_id: owner_id});
      if (existsRelationship){
        posts = await this.post_gateway.findAll({user_id: owner_id});
      } else {
        posts = await this.post_gateway.getPublicPosts({user_id: owner_id});
      }
    }
    return Promise.resolve({
      posts
    });
  }
}
