import { Global, Module, Provider } from '@nestjs/common';
import { ChatController } from '@application/api/http-rest/controller/chat.controller';
import { ChatConversationNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/chat/neo4j_chat_conversation_repository.adapter';
import { ChatMessageNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/chat/neo4j_chat_message_repository.adapter';
import { CreatePrivateChatConversationService } from '@core/service/chat/create_private_chat_conversation.service';
import { CreateGroupChatConversationService } from '@core/service/chat/create_group_chat_conversation.service';
import { GetChatMessageCollectionService } from '@core/service/chat/get_chat_message_collection.service';
import { GetChatConversationCollectionService } from '@core/service/chat/get_chat_conversation_collection.service';
import { CreateChatMessageService } from '@core/service/chat/create_chat_message.service';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';
import { AddMembersToGroupConversationService } from '@core/service/chat/add_members_to_group_conversation.service';
import { UpdateGroupConversationDetailsService } from '@core/service/chat/update_group_conversation_details.service';
import { DeleteChatGroupConversationService } from '@core/service/chat/delete_chat_group_conversation.service';
import { ExitChatGroupConversationService } from '@core/service/chat/exit_chat_group_conversation.service';

const persistence_providers: Array<Provider> = [
  {
    provide: ChatDITokens.ChatConversationRepository,
    useClass: ChatConversationNeo4jRepositoryAdapter
  },
  {
    provide: ChatDITokens.ChatMessageRepository,
    useClass: ChatMessageNeo4jRepositoryAdapter
  }
];

const use_case_providers: Array<Provider> = [
  {
    provide: ChatDITokens.CreatePrivateChatConversationInteractor,
    useFactory: (gateway) => new CreatePrivateChatConversationService(gateway),
    inject: [ChatDITokens.ChatConversationRepository]
  },
  {
    provide: ChatDITokens.CreateGroupChatConversationInteractor,
    useFactory: (gateway) => new CreateGroupChatConversationService(gateway),
    inject: [ChatDITokens.ChatConversationRepository]
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
    inject: [ChatDITokens.ChatMessageRepository, ChatDITokens.ChatConversationRepository]
  },
  {
    provide: ChatDITokens.GetChatMessageCollectionInteractor,
    useFactory: (gateway, conversation_gateway) => new GetChatMessageCollectionService(gateway, conversation_gateway),
    inject: [ChatDITokens.ChatMessageRepository, ChatDITokens.ChatConversationRepository]
  }
];

@Global()
@Module({
  controllers: [
    ChatController
  ],
  providers: [
    ...persistence_providers,
    ...use_case_providers,
  ],
  exports: [
    ChatDITokens.CreateChatMessageInteractor,
    ChatDITokens.CreatePrivateChatConversationInteractor
  ]
})
export class ChatModule {}
