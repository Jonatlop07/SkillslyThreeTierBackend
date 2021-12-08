import { Global, Module, Provider } from '@nestjs/common';
import { ChatController } from '@application/api/http-rest/controller/chat.controller';
import { ChatConversationNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/chat/neo4j_chat_conversation_repository.adapter';
import { ChatMessageNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/chat/neo4j_chat_message_repository.adapter';
import { CreateSimpleChatConversationService } from '@core/service/chat/create_simple_chat_conversation.service';
import { CreateGroupChatConversationService } from '@core/service/chat/create_group_chat_conversation.service';
import { GetChatMessageCollectionService } from '@core/service/chat/get_chat_message_collection.service';
import { GetChatConversationCollectionService } from '@core/service/chat/get_chat_conversation_collection.service';
import { CreateChatMessageService } from '@core/service/chat/create_chat_message.service';
import { ChatDITokens } from '@core/domain/chat/di/chat_di_tokens';

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
    provide: ChatDITokens.GetChatConversationCollectionInteractor,
    useFactory: (gateway) => new GetChatConversationCollectionService(gateway),
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
    ChatDITokens.CreateChatMessageInteractor
  ]
})
export class ChatModule {}