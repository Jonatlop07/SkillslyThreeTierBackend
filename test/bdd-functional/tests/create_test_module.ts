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
import { CreatePrivateChatConversationService } from '@core/service/chat/create_private_chat_conversation.service';
import { CreateGroupChatConversationService } from '@core/service/chat/create_group_chat_conversation.service';
import { GetChatConversationCollectionService } from '@core/service/chat/get_chat_conversation_collection.service';
import { CreateChatMessageService } from '@core/service/chat/create_chat_message.service';
import { GetChatMessageCollectionService } from '@core/service/chat/get_chat_message_collection.service';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { AddReactionService } from '@core/service/reaction/add_reaction.service';
import { ReactionInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/reaction_in_memory.repository';
import { QueryReactionsService } from '@core/service/reaction/query_reactions.service';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { CreateUserFollowRequestService } from '@core/service/user/follow_request/create_user_follow_request.service';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
<<<<<<< HEAD
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import { TemporalPostInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/temporal_post_in_memory.repository';
import { CreateTemporalPostService } from '@core/service/temp-post/create_temporal_post.service';
import { QueryTemporalPostService } from '@core/service/temp-post/query_temporal_post.service';
import { QueryTemporalPostCollectionService } from '@core/service/temp-post/query_temporal_post_collection.service';
import { DeleteTemporalPostService } from '@core/service/temp-post/delete_temporal_post.service';
=======
import { DeletePermanentPostService } from '@core/service/post/delete_permanent_post.service';
import { UpdateUserFollowRequestService } from '@core/service/user/follow_request/update_user_follow_request.service';
import { DeleteUserFollowRequestService } from '@core/service/user/follow_request/delete_user_follow_request.service';
import { GetUserFollowRequestCollectionService } from '@core/service/user/follow_request/get_user_follow_request_collection.service';
import { AddMembersToGroupConversationService } from '@core/service/chat/add_members_to_group_conversation.service';
import { UpdateGroupConversationDetailsService } from '@core/service/chat/update_group_conversation_details.service';
import { DeleteChatGroupConversationService } from '@core/service/chat/delete_chat_group_conversation.service';
import { ExitChatGroupConversationService } from '@core/service/chat/exit_chat_group_conversation.service';
import { GetPermanentPostCollectionOfFriendsService } from '@core/service/post/get_permanent_post_collection_of_friends.service';
>>>>>>> development

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
        provide: UserDITokens.CreateUserFollowRequestInteractor,
        useFactory: (gateway) => new CreateUserFollowRequestService(gateway),
        inject: [UserDITokens.UserRepository],
      },
      {
        provide: UserDITokens.UpdateUserFollowRequestInteractor,
        useFactory: (gateway) => new UpdateUserFollowRequestService(gateway),
        inject: [UserDITokens.UserRepository],
      },
      {
        provide: UserDITokens.DeleteUserFollowRequestInteractor,
        useFactory: (gateway) => new DeleteUserFollowRequestService(gateway),
        inject: [UserDITokens.UserRepository],
      },
      {
        provide: UserDITokens.GetUserFollowRequestCollectionInteractor,
        useFactory: (gateway) => new GetUserFollowRequestCollectionService(gateway),
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
        provide: TempPostDITokens.CreateTempPostInteractor,
        useFactory: (gateway) => new CreateTemporalPostService(gateway),
        inject: [TempPostDITokens.TempPostRepository],
      },
      {
        provide: PostDITokens.QueryPermanentPostInteractor,
        useFactory: (post_gateway, user_gateway) => new QueryPermanentPostService(post_gateway, user_gateway),
        inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
      },
      {
<<<<<<< HEAD
        provide: TempPostDITokens.QueryTemporalPostInteractor,
        useFactory: (temp_post_gateway, user_gateway) => new QueryTemporalPostService(temp_post_gateway, user_gateway),
        inject: [TempPostDITokens.TempPostRepository, UserDITokens.UserRepository],
      },
      {
        provide: PostDITokens.QueryPermanentPostCollectionInteractor,
        useFactory: (post_gateway, user_gateway) => new QueryPermanentPostCollectionService(post_gateway, user_gateway),
        inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
      },
      {
        provide: TempPostDITokens.QueryTemporalPostCollectionInteractor,
        useFactory: (temp_post_gateway, user_gateway) => new QueryTemporalPostCollectionService(temp_post_gateway, user_gateway),
        inject: [TempPostDITokens.TempPostRepository, UserDITokens.UserRepository],
      },
      {
        provide: TempPostDITokens.DeleteTemporalPostInteractor,
        useFactory: (query_gateway, delete_gateway) => new DeleteTemporalPostService(query_gateway, delete_gateway),
        inject: [TempPostDITokens.TempPostRepository, TempPostDITokens.TempPostRepository],
=======
        provide: PostDITokens.GetPermanentPostCollectionOfFriendsInteractor,
        useFactory: (post_gateway, user_gateway) => new GetPermanentPostCollectionOfFriendsService(post_gateway, user_gateway),
        inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
      },
      {
        provide: PostDITokens.DeletePermanentPostInteractor,
        useFactory: (post_gateway) => new DeletePermanentPostService(post_gateway),
        inject: [PostDITokens.PermanentPostRepository],
      },
      {
        provide: PostDITokens.QueryPermanentPostCollectionInteractor,
        useFactory: (user_gateway, relationship_gateway, post_gateway) => new QueryPermanentPostCollectionService(user_gateway, relationship_gateway, post_gateway),
        inject: [UserDITokens.UserRepository, UserDITokens.UserRepository, PostDITokens.PermanentPostRepository],
>>>>>>> development
      },
      {
        provide: PostDITokens.UpdatePermanentPostInteractor,
        useFactory: (gateway) => new UpdatePermanentPostService(gateway),
        inject: [PostDITokens.PermanentPostRepository],
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
        provide: ReactionDITokens.AddReactionInteractor,
        useFactory: (gateway, post_gateway) => new AddReactionService(gateway, post_gateway),
        inject: [ReactionDITokens.ReactionRepository, PostDITokens.PermanentPostRepository],
      },
      {
        provide: ReactionDITokens.QueryReactionsInteractor,
        useFactory: (gateway, post_gateway) => new QueryReactionsService(gateway, post_gateway),
        inject: [ReactionDITokens.ReactionRepository, PostDITokens.PermanentPostRepository],
      },
      {
        provide: PostDITokens.SharePermanentPostInteractor,
        useFactory: (post_gateway, user_gateway) => new SharePermanentPostService(post_gateway, user_gateway),
        inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
      },
      {
<<<<<<< HEAD
        provide: ChatDITokens.CreateSimpleChatConversationInteractor,
        useFactory: (gateway) => new CreateSimpleChatConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository],
=======
        provide: ChatDITokens.CreatePrivateChatConversationInteractor,
        useFactory: (gateway) => new CreatePrivateChatConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository]
>>>>>>> development
      },
      {
        provide: ChatDITokens.CreateGroupChatConversationInteractor,
        useFactory: (gateway) => new CreateGroupChatConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.GetChatConversationCollectionInteractor,
        useFactory: (gateway) => new GetChatConversationCollectionService(gateway),
        inject: [ChatDITokens.ChatConversationRepository]
      },
      {
        provide: ChatDITokens.AddMembersToGroupConversationInteractor,
        useFactory: (gateway) => new AddMembersToGroupConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository]
      },
      {
        provide: ChatDITokens.UpdateGroupConversationDetailsInteractor,
        useFactory: (gateway) => new UpdateGroupConversationDetailsService(gateway),
        inject: [ChatDITokens.ChatConversationRepository]
      },
      {
        provide: ChatDITokens.DeleteChatGroupConversationInteractor,
        useFactory: (gateway) => new DeleteChatGroupConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository]
      },
      {
        provide: ChatDITokens.ExitChatGroupConversationInteractor,
        useFactory: (gateway) => new ExitChatGroupConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository]
      },
      {
        provide: ChatDITokens.CreateChatMessageInteractor,
        useFactory: (gateway, conversation_gateway) => new CreateChatMessageService(gateway, conversation_gateway),
        inject: [ChatDITokens.ChatMessageRepository, ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.GetChatMessageCollectionInteractor,
        useFactory: (gateway, conversation_gateway) => new GetChatMessageCollectionService(gateway, conversation_gateway),
        inject: [ChatDITokens.ChatMessageRepository, ChatDITokens.ChatConversationRepository],
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
        useFactory: () => new PermanentPostInMemoryRepository(new Map()),
      },
      {
        provide: TempPostDITokens.TempPostRepository,
        useFactory: () => new TemporalPostInMemoryRepository(new Map()),
      },

      {
        provide: ReactionDITokens.ReactionRepository,
        useFactory: () => new ReactionInMemoryRepository(new Map()),
      },
      {
        provide: CommentDITokens.CommentRepository,
        useFactory: () => new CommentInMemoryRepository(new Map()),
      },
      {
        provide: ChatDITokens.ChatConversationRepository,
        useFactory: () => new ChatConversationInMemoryRepository(new Map()),
      },
      {
        provide: ChatDITokens.ChatMessageRepository,
        useFactory: () => new ChatMessageInMemoryRepository(new Map()),
      },
    ],
  }).compile();
}
