import { PostDITokens } from "@core/domain/post/di/post_di_tokens";
import GetPermanentPostCollectionOfFriendsGateway from "@core/domain/post/use-case/gateway/get_permanent_post_collection_of_friends.gateway";
import GetPermanentPostCollectionOfFriendsInputModel from "@core/domain/post/use-case/input-model/get_permanent_post_collection_of_friends.steps";
import { GetPermanentPostCollectionOfFriendsInteractor } from "@core/domain/post/use-case/interactor/get_permanent_post_collection_of_friends.interactor";
import GetPermanentPostCollectionOfFriendsOutputModel from "@core/domain/post/use-case/output-model/get_permanent_post_collection_of_friends.steps";
import { UserDITokens } from "@core/domain/user/di/user_di_tokens";
import { UserAccountNotFoundException } from "@core/domain/user/use-case/exception/user_account.exception";
import ExistsUsersGateway from "@core/domain/user/use-case/gateway/exists_user.gateway";
import { Inject, Logger } from "@nestjs/common";

export class GetPermanentPostCollectionOfFriendsService implements GetPermanentPostCollectionOfFriendsInteractor {
  private readonly logger: Logger = new Logger(GetPermanentPostCollectionOfFriendsService.name);

  constructor( 
    @Inject(PostDITokens.PermanentPostRepository)
    private readonly post_gateway: GetPermanentPostCollectionOfFriendsGateway,
    @Inject(UserDITokens.UserRepository)
    private readonly exists_user_gateway: ExistsUsersGateway,
  ) {}

  async execute(input: GetPermanentPostCollectionOfFriendsInputModel): Promise<GetPermanentPostCollectionOfFriendsOutputModel> {
    const {user_id, limit, offset} = input;
    const existsUser = await this.exists_user_gateway.existsById(user_id);
    if (!existsUser) {
      throw new UserAccountNotFoundException();
    }
    const posts = await this.post_gateway.getPostsOfFriends(user_id, {limit, offset});
    return {posts}; 
  }
}
