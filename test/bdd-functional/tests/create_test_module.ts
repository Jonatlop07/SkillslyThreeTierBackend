import { Test } from '@nestjs/testing';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/user_in_memory.repository';
import { ProfileInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/profile_in_memory.repository';
import { PermanentPostInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/permanent_post_in_memory.repository';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { QueryUserAccountService } from '@core/service/user/query_user_account.service';
import { UpdateUserAccountService } from '@core/service/user/update_user_account.service';
import { DeleteUserAccountService } from '@core/service/user/delete_user_account.service';
import { SearchUsersService } from '@core/service/user/search_users.service';
import { ValidateCredentialsService } from '@core/service/user/validate_credentials.service';
import { CreateProfileService } from '@core/service/profile/create_profile.service';
import { GetProfileService } from '@core/service/profile/get_profile.service';
import { EditProfileService } from '@core/service/profile/edit_profile.service';
import { CreatePermanentPostService } from '@core/service/post/create_permanent_post.service';
import { QueryPermanentPostService } from '@core/service/post/query_permanent_post.service';
import { QueryPermanentPostCollectionService } from '@core/service/post/query_permanent_post_collection.service';
import { UpdatePermanentPostService } from '@core/service/post/update_permanent_post.service';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { AddReactionService } from '@core/service/reaction/add_reaction.service';
import { ReactionInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/reaction_in_memory.repository';
import { QueryReactionsService } from '@core/service/reaction/query_reactions.service';

export async function createTestModule() {
  return await Test.createTestingModule({
    providers: [
      {
        provide: UserDITokens.CreateUserAccountInteractor,
        useFactory: (gateway) => new CreateUserAccountService(gateway),
        inject: [UserDITokens.UserRepository],
      },
      {
        provide: UserDITokens.QueryUserAccountInteractor,
        useFactory: (gateway) => new QueryUserAccountService(gateway),
        inject: [UserDITokens.UserRepository]
      },
      {
        provide: UserDITokens.UpdateUserAccountInteractor,
        useFactory: (gateway) => new UpdateUserAccountService(gateway),
        inject: [UserDITokens.UserRepository]
      },
      {
        provide: UserDITokens.DeleteUserAccountInteractor,
        useFactory: (gateway) => new DeleteUserAccountService(gateway),
        inject: [UserDITokens.UserRepository]
      },
      {
        provide: UserDITokens.SearchUsersInteractor,
        useFactory: (gateway) => new SearchUsersService(gateway),
        inject: [UserDITokens.UserRepository]
      },
      {
        provide: UserDITokens.ValidateCredentialsInteractor,
        useFactory: (gateway) => new ValidateCredentialsService(gateway),
        inject: [UserDITokens.UserRepository],
      },
      {
        provide: ProfileDITokens.CreateProfileInteractor,
        useFactory: (gateway) => new CreateProfileService(gateway),
        inject: [ProfileDITokens.ProfileRepository],
      },
      {
        provide: ProfileDITokens.GetProfileInteractor,
        useFactory: (gateway) => new GetProfileService(gateway),
        inject: [ProfileDITokens.ProfileRepository],
      },
      {
        provide: ProfileDITokens.EditProfileInteractor,
        useFactory: (gateway, getProfileInteractor) => new EditProfileService(gateway, getProfileInteractor),
        inject: [ProfileDITokens.ProfileRepository, ProfileDITokens.GetProfileInteractor],
      },
      {
        provide: PostDITokens.CreatePermanentPostInteractor,
        useFactory: (gateway) => new CreatePermanentPostService(gateway),
        inject: [PostDITokens.PermanentPostRepository]
      },
      {
        provide: PostDITokens.QueryPermanentPostInteractor,
        useFactory: (post_gateway, user_gateway) => new QueryPermanentPostService(post_gateway, user_gateway),
        inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
      },
      {
        provide: PostDITokens.QueryPermanentPostCollectionInteractor,
        useFactory: (post_gateway, user_gateway) => new QueryPermanentPostCollectionService(post_gateway, user_gateway),
        inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
      },
      {
        provide: PostDITokens.UpdatePermanentPostInteractor,
        useFactory: (gateway) => new UpdatePermanentPostService(gateway),
        inject: [PostDITokens.PermanentPostRepository]
      },
      {
        provide: ReactionDITokens.AddReactionInteractor,
        useFactory: (gateway, post_gateway) => new AddReactionService(gateway, post_gateway),
        inject: [ReactionDITokens.ReactionRepository, PostDITokens.PermanentPostRepository]
      },
      {
        provide: ReactionDITokens.QueryReactionsInteractor,
        useFactory: (gateway, post_gateway) => new QueryReactionsService(gateway, post_gateway),
        inject: [ReactionDITokens.ReactionRepository, PostDITokens.PermanentPostRepository]
      },
      {
        provide: UserDITokens.UserRepository,
        useFactory: () => new UserInMemoryRepository(new Map()),
      },
      {
        provide: ProfileDITokens.ProfileRepository,
        useFactory: () => new ProfileInMemoryRepository(new Map()),
      },
      {
        provide: PostDITokens.PermanentPostRepository,
        useFactory: () => new PermanentPostInMemoryRepository(new Map())
      },
      {
        provide: ReactionDITokens.ReactionRepository,
        useFactory: () => new ReactionInMemoryRepository(new Map()),
      },
    ],
  }).compile();
}
