import CreateEventGateway from '@core/domain/event/use-case/gateway/create_event.gateway';
import GetMyEventCollectionGateway from '@core/domain/event/use-case/gateway/get_my_event_collection.gateway';
import GetEventCollectionOfFriendsGateway from '@core/domain/event/use-case/gateway/get_event_collection_of_friends.gateway';
import CreateEventAssistantGateway from '@core/domain/event/use-case/gateway/assistance/create_event_assistance.gateway';
import ExistsEventGateway from '@core/domain/event/use-case/gateway/exists_event_gateway.gateway';
import GetEventAssistantCollectionGateway from '@core/domain/event/use-case/gateway/assistance/get_event_assistant_collection.gateway';
import DeleteEventAssistantGateway from '@core/domain/event/use-case/gateway/assistance/delete_event_assistance.gateway';
import { UpdateEventGateway } from '@core/domain/event/use-case/gateway/update_event.gateway';
import { DeleteEventGateway } from '@core/domain/event/use-case/gateway/delete_event.gateway';

export default interface EventRepository
  extends CreateEventGateway, GetEventCollectionOfFriendsGateway, GetMyEventCollectionGateway,
  CreateEventAssistantGateway, ExistsEventGateway, GetEventAssistantCollectionGateway, 
  DeleteEventAssistantGateway, UpdateEventGateway, DeleteEventGateway {}