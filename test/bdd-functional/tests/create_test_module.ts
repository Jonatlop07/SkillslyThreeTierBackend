import { Test } from '@nestjs/testing';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/user_in_memory.repository';
import { ProfileInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/profile_in_memory.repository';
import { PermanentPostInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/permanent_post_in_memory.repository';
import { CommentInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/comment_in_memory.repository';
import { ChatConversationInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/chat_conversation_in_memory.repository';
import { ChatMessageInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/chat_message_in_memory.repository';
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
import { CreateCommentInPermanentPostService } from '@core/service/comment/create_comment_in_permanent_post.service';
import { GetCommentsInPermanentPostService } from '@core/service/comment/get_comments_in_permanent_post';
import { SharePermanentPostService } from '@core/service/post/share_permanent_post.service';
import { CreateSimpleChatConversationService } from '@core/service/chat/create_simple_chat_conversation.service';
import { CreateGroupChatConversationService } from '@core/service/chat/create_group_chat_conversation.service';
import { CreateChatMessageService } from '@core/service/chat/create_chat_message.service';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';

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
        inject: [UserDITokens.UserRepository],
      },
      {
        provide: UserDITokens.UpdateUserAccountInteractor,
        useFactory: (gateway) => new UpdateUserAccountService(gateway),
        inject: [UserDITokens.UserRepository],
      },
      {
        provide: UserDITokens.DeleteUserAccountInteractor,
        useFactory: (gateway) => new DeleteUserAccountService(gateway),
        inject: [UserDITokens.UserRepository],
      },
      {
        provide: UserDITokens.SearchUsersInteractor,
        useFactory: (gateway) => new SearchUsersService(gateway),
        inject: [UserDITokens.UserRepository],
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
        inject: [PostDITokens.PermanentPostRepository],
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
        provide: CommentDITokens.CreateCommentInPermanentPostInteractor,
        useFactory: (gateway) => new CreateCommentInPermanentPostService(gateway),
        inject: [CommentDITokens.CommentRepository],
      },
      {
        provide: CommentDITokens.GetCommentsInPermamentPostInteractor,
        useFactory: (gateway) => new GetCommentsInPermanentPostService(gateway),
        inject: [CommentDITokens.CommentRepository],
      },
      {
        provide: PostDITokens.SharePermanentPostInteractor,
        useFactory: (post_gateway, user_gateway) => new SharePermanentPostService(post_gateway, user_gateway),
        inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
      },
      {
        provide: ChatDITokens.CreateSimpleChatConversationInteractor,
        useFactory: (gateway) => new CreateSimpleChatConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository]
      },
      {
        provide: ChatDITokens.CreateGroupChatConversationInteractor,
        useFactory: (gateway) => new CreateGroupChatConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository]
      },
      {
        provide: ChatDITokens.CreateChatMessageInteractor,
        useFactory: (gateway, conversation_gateway) => new CreateChatMessageService(gateway, conversation_gateway),
        inject: [ChatDITokens.ChatMessageRepository, ChatDITokens.ChatConversationRepository]
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
        provide: CommentDITokens.CommentRepository,
        useFactory: () => new CommentInMemoryRepository(new Map()),
      },
      {
        provide: ChatDITokens.ChatConversationRepository,
        useFactory: () => new ChatConversationInMemoryRepository(new Map())
      },
      {
        provide: ChatDITokens.ChatMessageRepository,
        useFactory: () => new ChatMessageInMemoryRepository(new Map())
      }
    ],
  }).compile();
}
