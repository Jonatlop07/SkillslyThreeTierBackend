import { EventController } from '@application/api/http-rest/controller/event.controller';
import { EventDITokens } from '@core/domain/event/di/event_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateEventService } from '@core/service/event/create_event.service';
import { Module, Provider } from '@nestjs/common';
import { UserModule } from '@application/module/user.module';
import { EventNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/event/neo4j_event_repository.adapter';
import { GetEventCollectionOfFriendsService } from '@core/service/event/get_event_collection_of_friends.service';
import { GetMyEventCollectionService } from '@core/service/event/get_my_event_collection.service';
import { CreateEventAssistantService } from '@core/service/event/assistant/create_event_assistant.service';
import { GetEventAssistantCollectionService } from '@core/service/event/assistant/get_event_assistant_collection.service';
import { DeleteEventAssistantService } from '@core/service/event/assistant/delete_event_assistant.service';
import { UpdateEventService } from '@core/service/event/udpate_event.service';

const persistence_providers: Array<Provider> = [
  {
    provide: EventDITokens.EventRepository,
    useClass: EventNeo4jRepositoryAdapter
  }
];

const use_case_providers: Array<Provider> = [
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
];

@Module({
  imports: [
    UserModule
  ],
  controllers: [
    EventController
  ],
  providers: [
    ...persistence_providers,
    ...use_case_providers
  ],
  exports: [
    EventDITokens.EventRepository,
  ]
})
export class EventModule {}
