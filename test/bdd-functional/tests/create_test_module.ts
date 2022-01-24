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
import { ProjectDITokens } from '@core/domain/project/di/project_di_tokens';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { AddReactionService } from '@core/service/reaction/add_reaction.service';
import { ReactionInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/reaction_in_memory.repository';
import { QueryReactionsService } from '@core/service/reaction/query_reactions.service';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import { CreateUserFollowRequestService } from '@core/service/user/follow_request/create_user_follow_request.service';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { TempPostDITokens } from '@core/domain/temp-post/di/temp-post_di_tokens';
import { TemporalPostInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/temporal_post_in_memory.repository';
import { CreateTemporalPostService } from '@core/service/temp-post/create_temporal_post.service';
import { QueryTemporalPostService } from '@core/service/temp-post/query_temporal_post.service';
import { QueryTemporalPostCollectionService } from '@core/service/temp-post/query_temporal_post_collection.service';
import { DeleteTemporalPostService } from '@core/service/temp-post/delete_temporal_post.service';
import { DeletePermanentPostService } from '@core/service/post/delete_permanent_post.service';
import { UpdateUserFollowRequestService } from '@core/service/user/follow_request/update_user_follow_request.service';
import { DeleteUserFollowRequestService } from '@core/service/user/follow_request/delete_user_follow_request.service';
import { GetUserFollowRequestCollectionService } from '@core/service/user/follow_request/get_user_follow_request_collection.service';
import { UpdateGroupService } from '@core/service/group/update_group.service';
import { DeleteGroupService } from '@core/service/group/delete_group.service';
import { CreateJoinGroupRequestService } from '@core/service/group/join-request/create_join_group_request.service';
import { DeleteJoinGroupRequestService } from '@core/service/group/join-request/delete_join_group_request.service';
import { UpdateGroupUserService } from '@core/service/group/join-request/update_group_user.service';
import { LeaveGroupService } from '@core/service/group/leave_group.service';
import { QueryGroupService } from '@core/service/group/query_group.service';
import { QueryGroupCollectionService } from '@core/service/group/query_group_collection.service';
import { GetJoinRequestsService } from '@core/service/group/join-request/get_join_requests.service';
import { QueryGroupUsersService } from '@core/service/group/query_group_users.service';
import { CreateProjectService } from '@core/service/project/create_project.service';
import { QueryProjectService } from '@core/service/project/query_project.service';
import { AddMembersToGroupConversationService } from '@core/service/chat/add_members_to_group_conversation.service';
import { UpdateGroupConversationDetailsService } from '@core/service/chat/update_group_conversation_details.service';
import { DeleteChatGroupConversationService } from '@core/service/chat/delete_chat_group_conversation.service';
import { ExitChatGroupConversationService } from '@core/service/chat/exit_chat_group_conversation.service';
import { GetPermanentPostCollectionOfFriendsService } from '@core/service/post/get_permanent_post_collection_of_friends.service';
import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import { CreateEventService } from '@core/service/event/create_event.service';
import { EventInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/event_in_memory.repository';
import { GetEventCollectionOfFriendsService } from '@core/service/event/get_event_collection_of_friends.service';
import { GetMyEventCollectionService } from '@core/service/event/get_my_event_collection.service';
import { CreateGroupService } from '@core/service/group/create_group.service';
import { ProjectInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/project_in_memory.repository';
import { GroupInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/group_in_memory.repository';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import { ServiceOfferInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/service_offer_in_memory.repository';
import { CreateServiceOfferService } from '@core/service/service-offer/create_service_offer.service';
import { CreateEventAssistantService } from '@core/service/event/assistant/create_event_assistant.service';
import { GetEventAssistantCollectionService } from '@core/service/event/assistant/get_event_assistant_collection.service';
import { DeleteEventAssistantService } from '@core/service/event/assistant/delete_event_assistant.service';
import { UpdateEventService } from '@core/service/event/udpate_event.service';
import { DeleteEventService } from '@core/service/event/delete_event.service';
import { GetMyEventAssistantCollectionService } from '@core/service/event/assistant/get_my_event_assistant_collection.service';
import { UpdateServiceOfferService } from '@core/service/service-offer/update_service_offer.service';
import { DeleteServiceOfferService } from '@core/service/service-offer/delete_service_offer.service';
import { QueryServiceOfferCollectionService } from '@core/service/service-offer/query_service_offer_collection.service';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestService } from '@core/service/service_request/create_service_request.service';
import { ServiceRequestInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/service_request_in_memory.repository';
import { UpdateServiceRequestService } from '@core/service/service_request/update_service_request.service';
import { DeleteServiceRequestService } from '@core/service/service_request/delete_service_request.service';
import { CreateServiceRequestApplicationService } from '@core/service/service_request/service-request-applications/create_application.service';
import { UpdateServiceRequestApplicationService } from '@core/service/service_request/service-request-applications/update_application.service';
import { GetServiceRequestApplicationsService } from '@core/service/service_request/service-request-applications/get_applications.service';
import { CreateServiceStatusUpdateRequestService } from '@core/service/service_request/request_cancel_or_completion.service';
import { QueryServiceRequestCollectionService } from '@core/service/service_request/query_service_request_collection.service';
import { UpdateServiceStatusUpdateRequestService } from '@core/service/service_request/update_service_status_update_request.service';
import { GetServiceRequestEvaluationApplicantService } from '@core/service/service_request/service-request-applications/get_evaluation_applicant.service';

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
        useFactory: (gateway, group_gateway) => new CreatePermanentPostService(gateway, group_gateway),
        inject: [PostDITokens.PermanentPostRepository, GroupDITokens.GroupRepository],
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
        provide: TempPostDITokens.QueryTemporalPostInteractor,
        useFactory: (temp_post_gateway, user_gateway) => new QueryTemporalPostService(temp_post_gateway, user_gateway),
        inject: [TempPostDITokens.TempPostRepository, UserDITokens.UserRepository],
      },
      {
        provide: PostDITokens.QueryPermanentPostCollectionInteractor,
        useFactory: (user_gateway, relationship_gateway, post_gateway) =>
          new QueryPermanentPostCollectionService(
            user_gateway,
            relationship_gateway,
            post_gateway,
          ),
        inject: [
          UserDITokens.UserRepository,
          UserDITokens.UserRepository,
          PostDITokens.PermanentPostRepository,
        ],
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
      },
      {
        provide: PostDITokens.GetPermanentPostCollectionOfFriendsInteractor,
        useFactory: (post_gateway, user_gateway) => new GetPermanentPostCollectionOfFriendsService(post_gateway, user_gateway),
        inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
      },
      {
        provide: PostDITokens.DeletePermanentPostInteractor,
        useFactory: (post_gateway, group_gateway) => new DeletePermanentPostService(post_gateway, group_gateway),
        inject: [PostDITokens.PermanentPostRepository, GroupDITokens.GroupRepository],
      },
      {
        provide: PostDITokens.QueryPermanentPostCollectionInteractor,
        useFactory: (user_gateway, relationship_gateway, post_gateway) => new QueryPermanentPostCollectionService(user_gateway, relationship_gateway, post_gateway),
        inject: [UserDITokens.UserRepository, UserDITokens.UserRepository, PostDITokens.PermanentPostRepository],
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
        provide: ChatDITokens.CreatePrivateChatConversationInteractor,
        useFactory: (gateway) => new CreatePrivateChatConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.CreateGroupChatConversationInteractor,
        useFactory: (gateway) => new CreateGroupChatConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.GetChatConversationCollectionInteractor,
        useFactory: (gateway) => new GetChatConversationCollectionService(gateway),
        inject: [ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.AddMembersToGroupConversationInteractor,
        useFactory: (gateway) => new AddMembersToGroupConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.UpdateGroupConversationDetailsInteractor,
        useFactory: (gateway) => new UpdateGroupConversationDetailsService(gateway),
        inject: [ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.DeleteChatGroupConversationInteractor,
        useFactory: (gateway) => new DeleteChatGroupConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.ExitChatGroupConversationInteractor,
        useFactory: (gateway) => new ExitChatGroupConversationService(gateway),
        inject: [ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.CreateChatMessageInteractor,
        useFactory: (gateway, conversation_gateway) => new CreateChatMessageService(gateway, conversation_gateway),
        inject: [ChatDITokens.ChatMessageRepository, ChatDITokens.ChatConversationRepository],
      },
      {
        provide: ChatDITokens.GetChatMessageCollectionInteractor,
        useFactory: (gateway, conversation_gateway) =>
          new GetChatMessageCollectionService(gateway, conversation_gateway),
        inject: [
          ChatDITokens.ChatMessageRepository,
          ChatDITokens.ChatConversationRepository,
        ],
      },
      {
        provide: ProjectDITokens.CreateProjectInteractor,
        useFactory: (gateway) => new CreateProjectService(gateway),
        inject: [ProjectDITokens.ProjectRepository],
      },
      {
        provide: ProjectDITokens.QueryProjectInteractor,
        useFactory: (gateway, user_gateway) => new QueryProjectService(gateway, user_gateway),
        inject: [ProjectDITokens.ProjectRepository, UserDITokens.UserRepository],
      },
      {
        provide: GroupDITokens.CreateGroupInteractor,
        useFactory: (gateway) => new CreateGroupService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.UpdateGroupInteractor,
        useFactory: (gateway) => new UpdateGroupService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.DeleteGroupInteractor,
        useFactory: (gateway) => new DeleteGroupService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.CreateJoinGroupRequestInteractor,
        useFactory: (gateway) => new CreateJoinGroupRequestService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.DeleteJoinGroupRequestInteractor,
        useFactory: (gateway) => new DeleteJoinGroupRequestService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.UpdateGroupUserInteractor,
        useFactory: (gateway) => new UpdateGroupUserService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.LeaveGroupInteractor,
        useFactory: (gateway) => new LeaveGroupService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.QueryGroupInteractor,
        useFactory: (gateway) => new QueryGroupService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.QueryGroupCollectionInteractor,
        useFactory: (gateway) => new QueryGroupCollectionService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.GetJoinRequestsInteractor,
        useFactory: (gateway) => new GetJoinRequestsService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: GroupDITokens.QueryGroupUsersInteractor,
        useFactory: (gateway) => new QueryGroupUsersService(gateway),
        inject: [GroupDITokens.GroupRepository],
      },
      {
        provide: EventDITokens.CreateEventInteractor,
        useFactory: (gateway, user_gateway) => new CreateEventService(gateway, user_gateway),
        inject: [EventDITokens.EventRepository, UserDITokens.UserRepository]
      },
      {
        provide: EventDITokens.GetEventCollectionOfFriendsInteractor,
        useFactory: (gateway, user_gateway) => new GetEventCollectionOfFriendsService(gateway, user_gateway),
        inject: [EventDITokens.EventRepository, UserDITokens.UserRepository]
      },
      {
        provide: EventDITokens.GetMyEventCollectionInteractor,
        useFactory: (gateway, user_gateway) => new GetMyEventCollectionService(gateway, user_gateway),
        inject: [EventDITokens.EventRepository, UserDITokens.UserRepository]
      },
      {
        provide: EventDITokens.CreateEventAssistantInteractor,
        useFactory: (gateway, user_gateway) => new CreateEventAssistantService(gateway, gateway, user_gateway),
        inject: [EventDITokens.EventRepository, UserDITokens.UserRepository]
      },
      {
        provide: EventDITokens.GetEventAssistantCollectionInteractor,
        useFactory: (gateway) => new GetEventAssistantCollectionService(gateway, gateway),
        inject: [EventDITokens.EventRepository]
      },
      {
        provide: EventDITokens.DeleteEventAssistantInteractor,
        useFactory: (gateway, user_gateway) => new DeleteEventAssistantService(gateway, user_gateway),
        inject: [EventDITokens.EventRepository, UserDITokens.UserRepository]
      },
      {
        provide: EventDITokens.UpdateEventInteractor,
        useFactory: (gateway, user_gateway) => new UpdateEventService(gateway, user_gateway),
        inject: [EventDITokens.EventRepository, UserDITokens.UserRepository]
      },
      {
        provide: EventDITokens.DeleteEventInteractor,
        useFactory: (gateway, user_gateway) => new DeleteEventService(gateway, user_gateway),
        inject: [EventDITokens.EventRepository, UserDITokens.UserRepository]
      },
      {
        provide: EventDITokens.GetMyEventAssistantCollectionInteractor,
        useFactory: (gateway, user_gateway) => new GetMyEventAssistantCollectionService(gateway, user_gateway),
        inject: [EventDITokens.EventRepository, UserDITokens.UserRepository]
      },
      {
        provide: ServiceOfferDITokens.CreateServiceOfferInteractor,
        useFactory: (gateway) => new CreateServiceOfferService(gateway),
        inject: [ServiceOfferDITokens.ServiceOfferRepository]
      },
      {
        provide: ServiceOfferDITokens.UpdateServiceOfferInteractor,
        useFactory: (gateway) => new UpdateServiceOfferService(gateway),
        inject: [ServiceOfferDITokens.ServiceOfferRepository]
      },
      {
        provide: ServiceOfferDITokens.DeleteServiceOfferInteractor,
        useFactory: (gateway) => new DeleteServiceOfferService(gateway),
        inject: [ServiceOfferDITokens.ServiceOfferRepository]
      },
      {
        provide: ServiceOfferDITokens.QueryServiceOfferCollectionInteractor,
        useFactory: (gateway) => new QueryServiceOfferCollectionService(gateway),
        inject: [ServiceOfferDITokens.ServiceOfferRepository]
      },
      {
        provide: ServiceRequestDITokens.CreateServiceRequestInteractor,
        useFactory: (gateway) => new CreateServiceRequestService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
      },
      {
        provide: ServiceRequestDITokens.UpdateServiceRequestInteractor,
        useFactory: (gateway) => new UpdateServiceRequestService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
      },
      {
        provide: ServiceRequestDITokens.DeleteServiceRequestInteractor,
        useFactory: (gateway) => new DeleteServiceRequestService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
      },
      {
        provide: ServiceRequestDITokens.CreateServiceRequestApplicationInteractor,
        useFactory: (gateway) =>  new CreateServiceRequestApplicationService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
      },
      {
        provide: ServiceRequestDITokens.UpdateServiceRequestApplicationInteractor,
        useFactory: (gateway) =>  new UpdateServiceRequestApplicationService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
      },
      {
        provide: ServiceRequestDITokens.GetServiceRequestApplicationsInteractor,
        useFactory: (gateway) =>  new GetServiceRequestApplicationsService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
      },
      {
        provide: ServiceRequestDITokens.CreateServiceStatusUpdateRequestInteractor,
        useFactory: (gateway) =>  new CreateServiceStatusUpdateRequestService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
      },
      {
        provide: ServiceRequestDITokens.QueryServiceRequestCollectionInteractor,
        useFactory: (gateway) =>  new QueryServiceRequestCollectionService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
      },
      {
        provide: ServiceRequestDITokens.UpdateServiceStatusUpdateRequestInteractor,
        useFactory: (gateway) =>  new UpdateServiceStatusUpdateRequestService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
      },
      {
        provide: ServiceRequestDITokens.GetServiceRequestEvaluationApplicantInteractor,
        useFactory: (gateway) =>  new GetServiceRequestEvaluationApplicantService(gateway),
        inject: [ServiceRequestDITokens.ServiceRequestRepository]
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
      {
        provide: EventDITokens.EventRepository,
        useFactory: () => new EventInMemoryRepository(new Map()),
      },
      {
        provide: GroupDITokens.GroupRepository,
        useFactory: () => new GroupInMemoryRepository(new Map()),
      },
      {
        provide: ProjectDITokens.ProjectRepository,
        useFactory: () => new ProjectInMemoryRepository(new Map())
      },
      {
        provide: ServiceOfferDITokens.ServiceOfferRepository,
        useFactory: () => new ServiceOfferInMemoryRepository(new Map())
      },
      {
        provide: ServiceRequestDITokens.ServiceRequestRepository,
        useFactory: () => new ServiceRequestInMemoryRepository(new Map())
      }
    ],
  }).compile();
}
